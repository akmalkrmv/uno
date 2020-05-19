import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { IPlayer, Card, IGame } from '../../models/index';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandComponent implements OnInit {
  @Input() game: IGame;
  @Input() player: IPlayer;
  @Input() isBeater: boolean;
  @Input() isCurrent: boolean;

  @Output() cardSelect = new EventEmitter<Card>();

  constructor() {}

  ngOnInit(): void {}

  public selectCard(card: Card) {
    if (this.isCurrent) {
      this.cardSelect.emit(card);
    }
  }

  public get sortedHand(): Card[] {
    if (!this.game) return [];
    if (!this.game.trump) return [];
    if (!this.player) return [];
    if (!this.player.hand) return [];

    return this.player.hand.sort((a, b) =>
      Card.compare(a, b, this.game.trump.suit)
    );
  }
}
