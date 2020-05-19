import { Injectable } from '@angular/core';
import { CardUtils } from './card-utils';
import { Card, MoveState, IPlayer } from '../models';

@Injectable({ providedIn: 'root' })
export class PlayerUtils {
  constructor(private utils: CardUtils) {}

  public canTake(player: IPlayer): boolean {
    return player.hand && player.hand.length < 4;
  }

  public points(player: IPlayer): number {
    return player.pointCards.reduce((total, card) => (total += card.point), 0);
  }

  public select(player: IPlayer, card: Card, state: MoveState): IPlayer {
    if (card.disabled) {
      console.error('Card is disabled');
      return player;
    }

    player = this.toggleSelection(player, card);

    if (state == 'move') {
      player = this.disableNotSelectedSuits(player);
    }

    return player;
  }

  public move(player: IPlayer): IPlayer {
    player = this.enableAll(player);
    player = this.removeSelected(player);
    return player;
  }

  public selected(player: IPlayer): IPlayer {
    return { ...player, hand: this.utils.selected(player.hand) };
  }

  public removeSelected(player: IPlayer): IPlayer {
    return { ...player, hand: this.utils.notSelected(player.hand) };
  }

  public selectedCards(player: IPlayer): Card[] {
    return this.utils.selected(player.hand);
  }

  public collect(player: IPlayer, cards: Card[]): IPlayer {
    return { ...player, pointCards: [...(player.pointCards || []), ...cards] };
  }

  public take(player: IPlayer, cards: Card[]): IPlayer {
    return { ...player, hand: [...(player.hand || []), ...cards] };
  }

  public enableAll(player: IPlayer): IPlayer {
    return { ...player, hand: this.utils.enableAll(player.hand) };
  }

  public deselectAll(player: IPlayer): IPlayer {
    return { ...player, hand: this.utils.deselectAll(player.hand) };
  }

  public toggleSelection(player: IPlayer, card: Card): IPlayer {
    return { ...player, hand: this.utils.toggleSelection(player.hand, card) };
  }

  public disableNotSelectedSuits(player: IPlayer): IPlayer {
    return { ...player, hand: this.utils.disableNotSelectedSuits(player.hand) };
  }
}
