import { Component, OnInit, OnDestroy } from '@angular/core';

import { GameService } from '../services/game.service';
import { GameStats } from '../models/game-stats';
import { Card } from '../models/card.model';
import { Player } from '../models/player';
import { GameOptions } from '../models/game-options';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, OnDestroy {
  public stats = new GameStats();

  public players$ = this.game.players$;
  public current$ = this.game.current$;
  public beater$ = this.game.beater$;

  public beatingCards$ = this.game.beatingCards$;
  public trump$ = this.game.trump$;
  public state$ = this.game.state$;
  public deck$ = this.game.deck$;
  public table$ = this.game.table$;

  constructor(public game: GameService) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.trump$.pipe(untilDestroyed(this)).subscribe((trump) => {
      // when trump changed, for each player
      this.players$.value.forEach((player) => {
        // create sorted hand
        player.sortedHand$ = player.hand$.pipe(
          map((items) =>
            items.sort((a, b) => Card.compareTrump(a, b, trump.suit))
          )
        );
      });
    });

    const options = new GameOptions();
    const players = [];

    players.push(new Player('Alice'));
    players.push(new Player('John'));
    players.push(new Player('Bob'));

    this.game.init(options, players);
    this.game.start();
  }

  public start() {
    this.game.start();
  }

  public canBeat(current: Card[], target: Card[]) {
    return this.game.canBeat(current, target);
  }
}
