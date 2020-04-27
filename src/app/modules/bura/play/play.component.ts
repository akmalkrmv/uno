import { Component, OnInit, OnDestroy } from '@angular/core';

import { GameService } from '../services/game.service';
import { GameStats } from '../models/game-stats';
import { Card } from '../models/card.model';
import { Player } from '../models/player';
import { GameOptions } from '../models/game-options';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { map } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, OnDestroy {
  public roomId: string;
  public stats = new GameStats();

  public players$ = this.game.players$;
  public current$ = this.game.current$;
  public beater$ = this.game.beater$;

  public beatingCards$ = this.game.beatingCards$;
  public trump$ = this.game.trump$;
  public state$ = this.game.state$;
  public deck$ = this.game.deck$;
  public table$ = this.game.table$;

  constructor(
    public game: GameService,
    private auth: AuthService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.roomId = this.activeRoute.snapshot.paramMap.get('id');

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

    // this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
    //   const options = new GameOptions();
    //   const player = new Player(user.id, user.name);

    //   this.game.init(this.roomId, options, player);
    //   this.game.start();
    // });

    // this.game.init(this.roomId, new Player('132', 'bob'));
  }

  public start() {
    this.game.start();
  }

  public canBeat(current: Card[], target: Card[]) {
    return this.game.canBeat(current, target);
  }
}
