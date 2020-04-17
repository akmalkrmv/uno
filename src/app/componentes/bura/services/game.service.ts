import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Card, CardSuit } from '../models/card.model';
import { Player } from '../models/player';
import { GameStats } from '../models/game-stats';

@Injectable({ providedIn: 'root' })
export class GameService {
  public deck$ = new BehaviorSubject<Card[]>([]);
  public table$ = new BehaviorSubject<Card[]>([]);
  public players$ = new BehaviorSubject<Card[]>([]);

  constructor() {}

  public init() {
    const deck = this.shuffle(this.generateDeck());
    this.deck$.next(deck);
  }

  public generateDeck(): Card[] {
    const deck = [];

    for (let index = 6; index <= 14; index++) {
      deck.push(new Card(index, CardSuit.club));
      deck.push(new Card(index, CardSuit.diamond));
      deck.push(new Card(index, CardSuit.heart));
      deck.push(new Card(index, CardSuit.spade));
    }

    return deck;
  }

  public shuffle<T>(arr: T[]): T[] {
    const array = [...arr];

    for (let index = array.length - 1; index > 0; index--) {
      const shift = Math.floor(Math.random() * (index + 1));
      [array[index], array[shift]] = [array[shift], array[index]];
    }

    return array;
  }

  public endGame(stats: GameStats, players: Player[]) {
    const maxPoint = Math.max(...players.map((player) => player.points));
    const winners = players
      .filter((player) => player.points == maxPoint)
      .map((player) => player.name);

    const pivots = {
      0: 6,
      20: 4,
      40: 2,
    };

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
}
