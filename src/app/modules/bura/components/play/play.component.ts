import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { GameStats, Card, IPlayer, GameOptions, IGame } from '../../models';
import { AuthService } from '@services/auth.service';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-play-cards',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, OnDestroy {
  public stats = new GameStats();
  public roomId: string;
  public isCreator = false;

  public player: IPlayer;
  public player$: Observable<IPlayer>;
  public isBeater$: Observable<boolean>;
  public isCurrent$: Observable<boolean>;

  public game$ = this.gameService.game$;

  constructor(
    private auth: AuthService,
    private gameService: GameService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.activeRoute.data
      .pipe(untilDestroyed(this))
      .subscribe((data: { roomId: string }) => {
        if (data.roomId) {
          this.roomId = data.roomId;
          this.init(this.auth.current.id, this.auth.current.name);
        }
      });
  }

  public async init(userId: string, userName: string) {
    const options = new GameOptions();
    this.player = {
      id: userId,
      name: userName,
      hand: [],
      pointCards: [],
    };

    this.isCreator = await this.gameService.init({
      options,
      roomId: this.roomId,
      playerId: this.player.id,
      isCreator: false,
    });

    this.player$ = this.gameService.game$.pipe(
      untilDestroyed(this),
      map(
        (game) =>
          game.players && game.players.find((player) => player.id == userId)
      )
    );

    this.isCurrent$ = this.gameService.game$.pipe(
      untilDestroyed(this),
      map((game) => game.current && game.current.id === userId)
    );

    this.isBeater$ = this.gameService.game$.pipe(
      untilDestroyed(this),
      map((game) => game.beater && game.beater.id === userId)
    );
  }

  public canStart(game: IGame): boolean {
    return game && game.players && game.players.length >= 2;
  }

  public get hasJoined() {
    return this.gameService.hasJoined(this.player);
  }

  public join() {
    this.gameService.join(this.player);
  }

  public create() {
    this.gameService.create();
    this.gameService.join(this.player);
  }

  public start() {
    this.gameService.start();
  }

  public canBeat(current: Card[], target: Card[]) {
    return this.gameService.canBeat(current, target);
  }

  public selectCard(card: Card) {
    this.gameService.selectCard(this.player, card);
  }
}
