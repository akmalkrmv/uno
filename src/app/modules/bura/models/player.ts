import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Card } from './card.model';
import { GameState } from './game-state';

export interface IPlayer {
  id: string;
  name: string;
  hand: Card[];
  pointCards: Card[];
  isMapped: boolean;
}

export class PlayerMapper {
  public static flaten(player: Player): IPlayer {
    return {
      id: player.id,
      name: player.name,
      hand: player.hand$.value,
      pointCards: player.pointCards$.value,
      isMapped: true,
    };
  }

  public static fromflat(data: IPlayer) {
    const player = new Player(data.id, data.name);

    player.hand$.next(data.hand);
    player.pointCards$.next(data.pointCards);

    return player;
  }
}

export class Player {
  public hand$ = new BehaviorSubject<Card[]>([]);
  public selected$ = new BehaviorSubject<Card[]>([]);
  public pointCards$ = new BehaviorSubject<Card[]>([]);

  public sortedHand$: Observable<Card[]>;
  public points$: Observable<number>;
  public points: number = 0;

  constructor(public id: string, public name: string) {
    this.points$ = this.pointCards$.pipe(map((cards) => this.total(cards)));
    this.points$.subscribe((points) => (this.points = points));
  }

  public get canTake(): boolean {
    return this.hand$.value.length < 4;
  }

  public select(card: Card, state?: GameState) {
    if (card.disabled) {
      return;
    }

    card.selected = !card.selected;

    if (state == 'move') {
      this.disableOtherSuits();
    }

    const hand = this.hand$.value;
    const selected = hand.filter((item) => item.selected);
    
    this.selected$.next([...selected]);
  }

  public move() {
    const selected = this.selected$.value;
    const hand = this.hand$.value
      .filter((card) => !card.selected) // Not selected cards
      .map((card) => ({ ...card, disabled: false })); // Enable cards

    this.hand$.next([...hand]);
    this.selected$.next([]);

    return selected;
  }

  public collect(cards: Card[]) {
    this.pointCards$.next([...this.pointCards$.value, ...cards]);
  }

  public take(cards: Card[]) {
    this.hand$.next([...this.hand$.value, ...cards]);
  }

  public total(cards: Card[]) {
    return cards.reduce((total, card) => (total += card.point), 0);
  }

  private disableOtherSuits() {
    const hand = this.hand$.value;
    const selected = hand.filter((item) => item.selected);

    if (selected && selected.length) {
      const suit = selected[0].suit;
      const disabled = hand.map((item) => ({
        ...item,
        disabled: item.suit != suit,
      }));

      this.hand$.next([...disabled]);
    }
  }
}
