import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Card } from '../models/card.model';
import { Player } from '../models/player';
import { GameState } from '../models/game-state';
import { GameStats } from '../models/game-stats';
import { GameOptions } from '../models/game-options';
import { DeckService } from './deck.service';
import { GameLocalService } from './game-local.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  public players$ = new BehaviorSubject<Player[]>([]);
  public current$ = new BehaviorSubject<Player>(null);
  public beater$ = new BehaviorSubject<Player>(null);

  public deck$ = new BehaviorSubject<Card[]>([]);
  public table$ = new BehaviorSubject<Card[]>([]);
  public trump$ = new BehaviorSubject<Card>(null);
  public beatingCards$ = new BehaviorSubject<Card[]>([]);

  public moves$ = new BehaviorSubject<number>(0);
  public changed$: EventEmitter<any>;
  public state$ = new BehaviorSubject<GameState>('move');
  public options = new GameOptions();
  public stats = new GameStats();

  constructor(private api: GameLocalService, private deck: DeckService) {}

  public stateMove = () => this.state$.next('move');
  public stateBeat = () => this.state$.next('beat');
  public stateTake = () => this.state$.next('take');
  public stateEnd = () => this.state$.next('end');

  public init(
    roomId: string,
    options: GameOptions,
    player: Player,
    isCreator = false
  ) {
    this.options = options;
    this.api.register(this, player.id, isCreator);
    this.changed$ = this.api.changed$;
  }

  public join(player: Player) {
    const players = this.players$.value;
    const hasJoined = players && players.find((item) => item.id === player.id);

    if (hasJoined) return;

    this.players$.next([...this.players$.value, player]);
    this.api.notifyChanges();
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
    this.api.notifyChanges();
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
    this.api.notifyChanges();
  }

  public move(player: Player) {
    const selected = player.move();

    this.beatingCards$.next(selected);
    this.beater$.next(player);

    this.putOnTable(selected);
    this.nextPlayer();
    this.stateBeat();
    this.api.notifyChanges();
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
    this.api.notifyChanges();
  }

  public give(player: Player) {
    const selected = player.move();

    this.putOnTable(selected);
    this.nextPlayer();
    this.api.notifyChanges();
  }

  public endCirlce() {
    console.log('edn circle');
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

    this.api.notifyChanges();
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

    this.api.notifyChanges();
  }

  public nextPlayer(): void {
    const players = this.players$.value;
    const current = this.current$.value;
    const moves = this.moves$.value + 1;

    if (moves === players.length) {
      this.moves$.next(0);
      this.endCirlce();
      return;
    }

    const index = players.findIndex((player) => player.id === current.id);
    const nextPlayer = players[(index + 1) % players.length];

    this.current$.next(nextPlayer);
    this.moves$.next(moves);
    this.api.notifyChanges();
  }

  public canBeat(current: Card[], target: Card[]) {
    const trumpsuit = this.trump$.value.suit;
    return this.deck.canBeat(current, target, trumpsuit);
  }

  public putOnTable(cards: Card[]) {
    this.table$.next([...this.table$.value, ...cards]);
  }
}
