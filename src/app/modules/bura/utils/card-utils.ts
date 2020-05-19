import { Injectable } from '@angular/core';
import { Card, CardSuit } from '../models';

@Injectable({ providedIn: 'root' })
export class CardUtils {
  public isEqual(cardA: Card, cardB: Card): boolean {
    return cardA.name === cardB.name && cardA.suit === cardB.suit;
  }

  public selected(cards: Card[]): Card[] {
    return cards ? cards.filter((card) => card.selected) : [];
  }

  public notSelected(cards: Card[]): Card[] {
    return cards ? cards.filter((card) => !card.selected) : [];
  }

  public enableAll(cards: Card[]) {
    return cards ? cards.map((card) => ({ ...card, disabled: false })) : [];
  }

  public deselectAll(cards: Card[]) {
    return cards ? cards.map((card) => ({ ...card, selected: false })) : [];
  }

  public disableNotSelectedSuits(cards: Card[]): Card[] {
    const selected = this.selected(cards);
    const hasSelected = selected && selected.length > 0;

    return hasSelected
      ? this.disableOtherSuits(cards, selected[0].suit)
      : this.enableAll(cards);
  }

  public disableOtherSuits(cards: Card[], suit: CardSuit): Card[] {
    return cards
      ? cards.map((card) => ({ ...card, disabled: card.suit != suit }))
      : [];
  }

  public toggleSelection(cards: Card[], card: Card): Card[] {
    return cards
      ? cards.map((item) =>
          this.isEqual(card, item) ? this.toggle(card) : item
        )
      : [];
  }

  public toggle(card: Card): Card {
    return { ...card, selected: !card.selected };
  }
}
