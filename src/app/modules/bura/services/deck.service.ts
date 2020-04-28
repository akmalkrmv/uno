import { Injectable } from '@angular/core';
import { Card, CardSuit } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class DeckService {
  constructor() {}

  public generate(): Card[] {
    const deck = [];

    for (let index = 6; index <= 14; index++) {
      deck.push(new Card(index, CardSuit.club));
      deck.push(new Card(index, CardSuit.diamond));
      deck.push(new Card(index, CardSuit.heart));
      deck.push(new Card(index, CardSuit.spade));
    }

    return this.shuffle(deck);
  }

  public shuffle<T>(arr: T[]): T[] {
    const array = [...arr];

    for (let index = array.length - 1; index > 0; index--) {
      const shift = Math.floor(Math.random() * (index + 1));
      [array[index], array[shift]] = [array[shift], array[index]];
    }

    return array;
  }

  public canBeat(current: Card[], target: Card[], trumpsuit: CardSuit) {
    // Are not ampty and same length
    if (!this.isBeatable(current, target)) {
      return false;
    }

    // Has only one suit and/or trump suit
    if (!this.hasCorrectSuits(current, target, trumpsuit)) {
      return false;
    }

    // Order before check
    current = [...current].sort((a, b) =>
      this.compareBeatpoint(a, b, trumpsuit)
    );
    target = [...target].sort((a, b) => this.compareBeatpoint(a, b, trumpsuit));

    // Compare one by one
    for (let index = 0; index < current.length; index++) {
      if (this.compareBeatpoint(current[index], target[index], trumpsuit) < 1) {
        return false;
      }
    }

    return true;
  }

  private hasCorrectSuits(current: Card[], target: Card[], trump: CardSuit) {
    const isAvailableSuit = (card: Card) =>
      card.suit == trump || card.suit == target[0].suit;

    current = [...current].filter((card) => isAvailableSuit(card));
    target = [...target].filter((card) => isAvailableSuit(card));

    // Are still not ampty and same length
    return this.isBeatable(current, target);
  }

  private isBeatable(current: Card[], target: Card[]) {
    return (
      current.length > 0 && target.length > 0 && current.length == target.length
    );
  }

  private compareBeatpoint(a: Card, b: Card, trump: CardSuit) {
    const pointA = a.suit == trump ? a.beatpoint + 100 : a.beatpoint;
    const pointB = b.suit == trump ? b.beatpoint + 100 : b.beatpoint;

    if (pointA > pointB) return 1;
    if (pointA < pointB) return -1;

    return 0;
  }
}
