import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card } from '../models/card.model';
import { Player } from '../models/player';
import { GameState } from '../models/game-state';
import { GameStats } from '../models/game-stats';
import { GameOptions } from '../models/game-options';
import { GameApiService, GameEvent } from './game-api.service';
import { DeckService } from './deck.service';
import { GameLocalService } from './game-local.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  public players$ = new BehaviorSubject<Player[]>([]);
  public current$ = new BehaviorSubject<Player>(null);
  public beater$ = new BehaviorSubject<Player>(null);

  public deck$ = new BehaviorSubject<Card[]>([]);
  public table$ = new BehaviorSubject<Card[]>([]);
  public beatingCards$ = new BehaviorSubject<Card[]>([]);
  public trump$ = new BehaviorSubject<Card>(null);

  public state$ = new BehaviorSubject<GameState>('move');
  public options = new GameOptions();
  public stats = new GameStats();
  public moves = 0;

  constructor(private api: GameLocalService, private deck: DeckService) {}

  public stateMove = () => this.state$.next('move');
  public stateBeat = () => this.state$.next('beat');
  public stateTake = () => this.state$.next('take');
  public stateEnd = () => this.state$.next('end');

  public init(roomId: string, options: GameOptions, player: Player) {
    this.options = options;

    // this.api.init(roomId).then(() => {
    //   this.api.join(roomId, player.id);

    //   this.api.changes$.subscribe((changes) => {
    //     changes.forEach((change) => this.handleChange(change));
    //   });
    //   this.api.players$.subscribe((players) => {
    //     console.log(players);
    //     this.players$.next(players.map((pl) => new Player(pl, 'QWERTY')));
    //   });
    // });

    this.api.init(roomId);
    this.api.create(new GameEvent());
  }

  public start() {
    const cards = this.deck.generate();
    const lastCard = cards[cards.length - 1];
    const players = this.players$.value;

    this.deck$.next(cards);
    this.trump$.next(lastCard);
    this.beater$.next(players[0]);
    this.current$.next(players[0]);

    this.fillHands();
    this.stateMove();
  }

  public end(stats: GameStats) {
    // const stats = this.stats;
    const players = this.players$.value;
    const pivots = this.options.pivots;

    const maxPoint = Math.max(...players.map((player) => player.points));
    const winners = players
      .filter((player) => player.points == maxPoint)
      .map((player) => player.name);

    for (const player of players) {
      Object.keys(pivots).forEach((pivot) => {
        if (player.points > +pivot) {
          stats.points[player.name] = pivots[pivot];
        }
      });
    }

    stats.lastWinners = winners;
    stats.round++;
  }

  public move(player: Player) {
    const selected = player.move();

    this.beatingCards$.next(selected);
    this.beater$.next(player);

    this.putOnTable(selected);
    this.nextPlayer();
    this.stateBeat();
  }

  public beat(player: Player) {
    const selected = player.move();
    const beatingCards = this.beatingCards$.value;

    if (this.canBeat(selected, beatingCards)) {
      this.beatingCards$.next(selected);
      this.beater$.next(player);
    }

    this.putOnTable(selected);
    this.nextPlayer();
  }

  public give(player: Player) {
    const selected = player.move();

    this.putOnTable(selected);
    this.nextPlayer();
  }

  public endCirlce() {
    const beater = this.beater$.value;
    const table = this.table$.value;

    beater.collect(table);

    this.current$.next(beater);
    this.beatingCards$.next([]);
    this.table$.next([]);

    this.stateMove();
    this.fillHands();

    if (!this.deck$.value.length && !beater.hand$.value.length) {
      this.stateEnd();
      this.end(this.stats);
    }
  }

  public fillHands() {
    if (!this.deck$.value.length) {
      return;
    }

    const players = this.players$.value;

    for (let index = 0; index < 4; index++) {
      players.forEach((player) => {
        if (player.canTake) {
          const deck = this.deck$.value;
          const hand = deck.splice(0, 1);

          player.take(hand);
          this.deck$.next(deck);
        }
      });
    }
  }

  public nextPlayer(): void {
    const players = this.players$.value;
    const current = this.current$.value;

    this.moves++;

    if (this.moves === players.length) {
      this.moves = 0;
      this.endCirlce();
      return;
    }

    const index = players.indexOf(current);
    const nextPlayer = players[(index + 1) % players.length];

    this.current$.next(nextPlayer);
  }

  public canBeat(current: Card[], target: Card[]) {
    const trumpsuit = this.trump$.value.suit;
    return this.deck.canBeat(current, target, trumpsuit);
  }

  public putOnTable(cards: Card[]) {
    this.table$.next([...this.table$.value, ...cards]);
  }

  public join(id: string, name: string) {
    const change = { action: 'join', payload: { id, name } };
    this.api.create(change).subscribe();
  }

  public fireMove(player: Player) {
    const change = {
      action: 'move',
      payload: {
        player: player.id,
        selected: player.move(),
      },
    };
    this.api.create(change).subscribe();
  }

  public handleChange(change: GameEvent) {
    console.log('change: ', change);
    switch (change.action) {
      case 'join': {
        const player = new Player(change.payload.id, change.payload.name);
        this.players$.next([...this.players$.value, player]);
        break;
      }
      case 'move': {
        const player = this.players$.value.find((p) => p.id == player.id);
        this.move(player);
        break;
      }
    }
  }
}
