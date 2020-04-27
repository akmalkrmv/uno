import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from './card.model';
import { GameState } from './game-state';

export class Player {
  public sortedHand$: Observable<Card[]>;

  public hand$ = new BehaviorSubject<Card[]>([]);
  public selected$ = new BehaviorSubject<Card[]>([]);
  public pointCards$ = new BehaviorSubject<Card[]>([]);
  public points: number = 0;

  constructor(public id: string, public name: string) {
    this.pointCards$.subscribe((cards) => {
      this.points = cards.reduce((total, card) => (total += card.point), 0);
    });
  }

  public get canTake(): boolean {
    return this.hand$.value.length < 4;
  }

  public select(card: Card, state?: GameState) {
    if (card.disabled) {
      return;
    }

    const selected = this.selected$.value;
    const hand = this.hand$.value;

    card.selected = !card.selected;
    card.selected
      ? selected.push(card)
      : selected.splice(selected.indexOf(card), 1);

    if (state == 'move') {
      const suit = selected.length ? selected[0].suit : null;
      const disabled = hand.map((item) => ({
        ...item,
        disabled: suit ? item.suit != suit : false,
      }));

      this.hand$.next(disabled);
    }

    this.selected$.next([...selected]);
  }

  public move() {
    const hand = this.hand$.value
      .filter((card) => !card.selected) // Not selected cards
      .map((card) => ({ ...card, disabled: false })); // Enable cards

    const selected = this.selected$.value.map((card) => ({
      ...card,
      selected: false,
    }));

    this.hand$.next(hand);
    this.selected$.next([]);

    return selected;
  }

  public collect(cards: Card[]) {
    this.pointCards$.next([...this.pointCards$.value, ...cards]);
  }

  public take(cards: Card[]) {
    this.hand$.next([...this.hand$.value, ...cards]);
  }
}
