import { Component, OnInit, Input } from '@angular/core';
import { Card, IPlayer, IGame } from '../../models/index';
import { GameService } from '../../services/game.service';
import { PlayerUtils } from '../../utils/player.utils';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  @Input() game: IGame;
  @Input() player: IPlayer;

  constructor(
    private gameService: GameService,
    private playerService: PlayerUtils
  ) {}

  ngOnInit(): void {}

  public move() {
    this.gameService.move(this.player);
  }

  public beat() {
    this.gameService.beat(this.player);
  }

  public give() {
    this.gameService.give(this.player);
  }

  public get selected() {
    return this.playerService.selectedCards(this.player);
  }

  public get canMove() {
    return this.selected && this.selected.length > 0;
  }

  public get canGive() {
    return this.game.beatingCards.length == this.selected.length;
  }

  public get canBeat() {
    return this.gameService.canBeat(this.selected, this.game.beatingCards);
  }
}
