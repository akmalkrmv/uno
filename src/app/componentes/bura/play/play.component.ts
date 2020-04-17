import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject } from 'rxjs';

import { GameService } from '../services/game.service';
import { GameStats } from '../models/game-stats';
import { Card, CardSuit } from '../models/card.model';
import { Player, GameState, TrumpBeatPoint } from '../models/player';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, OnDestroy {
  public state: GameState = 'move';
  public beatingCards: Card[] = [];
  public trump$ = new BehaviorSubject<Card>(null);

  public players: Player[] = [];
  public beatingPlayer: Player;
  public currentPlayer: Player;
  public movesCount = 0;
  public stats = new GameStats();

  constructor(public game: GameService) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.game.init();

    this.game.deck$.pipe(untilDestroyed(this)).subscribe((items) => {
      if (!this.trump$.value) {
        const trump = items[items.length - 1];
        this.trump$.next(trump);
        this.game.deck$.next(
          this.increaseTrumpPoint(this.game.deck$.value, trump.suit)
        );
      }
    });

    this.players.push(new Player('Alice'));
    this.players.push(new Player('Bob'));
    this.players.push(new Player('John'));

    this.currentPlayer = this.players[0];
    this.beatingPlayer = this.players[0];

    this.fillHands();

    this.game.endGame(this.stats, this.players);
  }

  public start() {
    this.game.init();
    this.state = 'move';
  }

  public move(player: Player) {
    const selected = player.move();
    const table = this.game.table$.value;

    this.game.table$.next([...table, ...selected]);
    this.beatingCards = selected;
    this.beatingPlayer = player;

    this.state = 'beat';
    this.nextPlayer();
  }

  public beat(player: Player) {
    const selected = player.move();
    const table = this.game.table$.value;

    if (this.canBeat(selected, this.beatingCards)) {
      this.beatingCards = selected;
      this.beatingPlayer = player;
    }

    this.game.table$.next([...table, ...selected]);
    this.nextPlayer();
  }

  public give(player: Player) {
    const selected = player.move();
    const table = this.game.table$.value;

    this.game.table$.next([...table, ...selected]);
    this.nextPlayer();
  }

  public endCirlce() {
    this.beatingPlayer.pointCards$.next([
      ...this.beatingPlayer.pointCards$.value,
      ...this.game.table$.value,
    ]);

    this.currentPlayer = this.beatingPlayer;
    this.beatingCards = [];
    this.game.table$.next([]);
    this.state = 'move';
    this.fillHands();

    if (!this.game.deck$.value.length && !this.currentPlayer.hand.length) {
      this.state = 'end';
      this.game.endGame(this.stats, this.players);
    }
  }

  public fillHands() {
    if (!this.game.deck$.value.length) {
      return;
    }

    for (let index = 0; index < 4; index++) {
      this.players.forEach((player) => {
        if (player.hand.length >= 4) {
          return;
        }

        const deck = this.game.deck$.value;
        const hand = deck.splice(0, 1);

        player.hand$.next([...player.hand, ...hand]);
        this.game.deck$.next(deck);
      });
    }
  }

  public nextPlayer(): void {
    if (++this.movesCount === this.players.length) {
      this.currentPlayer = this.beatingPlayer;
      this.movesCount = 0;
      this.endCirlce();
      return;
    }

    const index = this.players.indexOf(this.currentPlayer);
    const nextPlayer = this.players[(index + 1) % this.players.length];

    this.currentPlayer = nextPlayer;
  }

  public canBeat(current: Card[], target?: Card[]) {
    target = target || this.beatingCards;

    if (!current.length || !target.length || current.length != target.length) {
      return false;
    }

    const trumpsuit = this.trump$.value.suit;
    const targetsuit = target[0].suit;

    current = [...current].filter(
      (card) => card.suit == trumpsuit || card.suit == targetsuit
    );
    target = [...target].filter(
      (card) => card.suit == trumpsuit || card.suit == targetsuit
    );

    if (!current.length || !target.length || current.length != target.length) {
      return false;
    }

    // Can beat
    current = [...current].sort((a, b) => Card.compare(a, b));
    target = [...target].sort((a, b) => Card.compare(a, b));

    for (let index = 0; index < current.length; index++) {
      // if (Card.compare(current[index], target[index])) {
      //   return false;
      // }

      if (current[index].beatpoint <= target[index].beatpoint) {
        return false;
      }
    }

    return true;
  }

  private increaseTrumpPoint(cards: Card[], trumpsuit: CardSuit) {
    return [...cards].map((card) => ({
      ...card,
      beatpoint:
        card.suit == trumpsuit
          ? card.beatpoint + TrumpBeatPoint
          : card.beatpoint,
    }));
  }
}
