import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { GameService } from '../../services/game.service';
import { GameStats } from '../../models/game-stats';
import { Card } from '../../models/card.model';
import { Player } from '../../models/player';
import { GameOptions } from '../../models/game-options';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { map } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, OnDestroy {
  public stats = new GameStats();
  public roomId: string;
  public isCreator: boolean;

  public player: Player;
  public player$: Observable<Player>;
  public isCurrent$: Observable<boolean>;
  public isBeater$: Observable<boolean>;

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
    private activeRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.isCreator = this.activeRoute.snapshot.fragment === 'init';

    // this.auth.user$.pipe(untilDestroyed(this)).subscribe((user) => {
    //   this.init(user.id, user.name);
    // });

    const id = Math.floor(Math.random() * 100000).toString();
    this.init(id, id);
  }

  public init(userId, userName) {
    const options = new GameOptions();
    const player = new Player(userId, userName);

    this.game.init(this.roomId, options, player, this.isCreator);
    this.player = player;

    this.player$ = this.players$.pipe(
      map((players) => players.find((player) => player.id == userId))
    );

    this.game.changed$.pipe(untilDestroyed(this)).subscribe(() => {
      this.sortHands();
      this.isCurrent$ = this.game.current$.pipe(
        untilDestroyed(this),
        map((current) => current && current.id === userId)
      );
      this.isBeater$ = this.game.beater$.pipe(
        untilDestroyed(this),
        map((beater) => beater && beater.id === userId)
      );
      this.changeDetectorRef.detectChanges();
    });
  }

  public join() {
    this.game.join(this.player);
  }

  public start() {
    this.game.start();
  }

  public canBeat(current: Card[], target: Card[]) {
    return this.game.canBeat(current, target);
  }

  public selectCard(player: Player, card: Card) {
    player.select(card, this.state$.value);
    this.changeDetectorRef.detectChanges();
  }

  private sortHands() {
    this.game.trump$.pipe(untilDestroyed(this)).subscribe((trump) => {
      const players = this.game.players$.value;
      if (!trump) return;
      if (!players) return;

      // when trump changed, for each player
      players.forEach((player) => {
        // create sorted hand
        player.sortedHand$ = player.hand$.pipe(
          map((items) =>
            items.sort((a, b) => Card.compareTrump(a, b, trump.suit))
          )
        );

        this.changeDetectorRef.detectChanges();
      });
    });
  }
}
