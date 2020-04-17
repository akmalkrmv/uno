import { BehaviorSubject } from 'rxjs';
import { Card } from './card.model';

export type GameState = 'move' | 'beat' | 'take' | 'end';
export const TrumpBeatPoint = 30;

export class Player {
  public hand$ = new BehaviorSubject<Card[]>([]);
  public hand: Card[] = [];
  public selected: Card[] = [];
  
  public pointCards$ = new BehaviorSubject<Card[]>([]);
  public points: number = 0;

  constructor(public name: string) {
    this.pointCards$.subscribe((cards) => {
      this.points = cards.reduce((total, card) => (total += card.point), 0);
    });

    this.hand$.subscribe(
      (items) => (this.hand = items.sort((a, b) => Card.compare(a, b)))
    );
  }

  public select(card: Card, state?: GameState) {
    if (card.disabled) {
      return;
    }

    card.selected = !card.selected;
    card.selected
      ? this.selected.push(card)
      : this.selected.splice(this.selected.indexOf(card), 1);

    if (state == 'move') {
      const selectedSuit = this.selected.length ? this.selected[0].suit : null;

      this.hand.forEach(
        (item) =>
          (item.disabled = selectedSuit ? item.suit != selectedSuit : false)
      );
    }
  }

  public move() {
    this.hand = this.hand
      .filter((card) => !card.selected)
      .map((card) => ({ ...card, disabled: false }));

    const selected = this.selected.map((card) => ({
      ...card,
      selected: false,
    }));

    this.selected = [];

    return selected;
  }
}
