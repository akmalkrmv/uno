import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { GameState } from '../models/game-state';
import { Player } from '../models/player';
import { Card } from '../models/card.model';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlsComponent implements OnInit {
  @Input() game: GameService;
  @Input() player: Player;
  @Input() current: Player;
  @Input() state: GameState = 'move';
  @Input() selected: Card[] = [];
  @Input() beatingCards: Card[] = [];

  constructor() {}

  ngOnInit(): void {}

  public move(player: Player) {
    this.game.move(player);
  }

  public beat(player: Player) {
    this.game.beat(player);
  }

  public give(player: Player) {
    this.game.give(player);
  }

  public get canMove() {
    return this.selected && this.selected.length > 0;
  }

  public get canBeat() {
    return this.game.canBeat(this.player.selected$.value, this.beatingCards);
  }

  public get canGive() {
    return this.beatingCards.length == this.player.selected$.value.length;
  }
}
