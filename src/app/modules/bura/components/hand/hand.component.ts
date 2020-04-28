import { Component, OnInit, Input } from '@angular/core';
import { Player } from '../../models/player';
import { Card } from '../../models/card.model';
import { GameState } from '../../models/game-state';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
})
export class HandComponent implements OnInit {
  @Input() player: Player;
  @Input() current: Player;
  @Input() isBeater: boolean;
  @Input() isCurrent: boolean;
  @Input() beatingCards: Card[];
  @Input() game: GameService;
  @Input() state: GameState;

  constructor() {}

  ngOnInit(): void {}
}
