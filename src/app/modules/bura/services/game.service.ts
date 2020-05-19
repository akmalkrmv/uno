import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GamePodcastService } from './game-podcast.service';
import { IGame, IPlayer, Card, IGameInitData } from '../models';
import { GameUtils } from '../utils/game-utils';

@Injectable({ providedIn: 'root' })
export class GameService {
  public changed$: EventEmitter<any>;
  public game$ = new BehaviorSubject<IGame>(null);
  private gameInitData: IGameInitData;

  private get game(): IGame {
    return this.game$.value;
  }

  private set game(value: IGame) {
    this.game$.next(value);
    // this.podcast.notifyChanges();
    // console.log({ before: this.game, after: value });
  }

  constructor(
    private gameUtils: GameUtils,
    private podcast: GamePodcastService
  ) {}

  public async init(gameInitData: IGameInitData): Promise<boolean> {
    this.gameInitData = gameInitData;
    const existingGame = await this.podcast.register(this, gameInitData);

    if (existingGame) {
      this.game = existingGame;
      this.gameInitData.isCreator =
        existingGame.creatorId === gameInitData.playerId;
    } else {
      this.createEmpty();
    }

    return this.gameInitData.isCreator;
  }

  public hasJoined(player: IPlayer): boolean {
    return this.gameUtils.hasJoined(this.game, player);
  }

  public canBeat(current: Card[], target: Card[]): boolean {
    return this.gameUtils.canBeat(this.game, current, target);
  }

  public createEmpty(): void {
    this.gameInitData = {
      ...this.gameInitData,
      state: 'empty',
      isCreator: true,
    };
    this.game = this.gameUtils.create(this.gameInitData);
    this.podcast.notifyChanges();
  }

  public create(): void {
    this.gameInitData = { ...this.gameInitData, state: 'new', isCreator: true };
    this.game = this.gameUtils.create(this.gameInitData);
    this.podcast.notifyChanges();
  }

  public join(player: IPlayer): void {
    this.game = this.gameUtils.join(this.game, player);
    this.podcast.notifyChanges();
  }

  public start(): void {
    this.game = this.gameUtils.start(this.game);
    this.podcast.notifyChanges();
  }

  public end(): void {
    this.game = this.gameUtils.end(this.game);
    this.podcast.notifyChanges();
  }

  public selectCard(player: IPlayer, card: Card): void {
    this.game = this.gameUtils.selectCard(this.game, player, card);
  }

  public move(player: IPlayer): void {
    this.game = this.gameUtils.move(this.game, player);
    this.podcast.notifyChanges();
  }

  public beat(player: IPlayer): void {
    this.game = this.gameUtils.beat(this.game, player);
    this.podcast.notifyChanges();
  }

  public give(player: IPlayer): void {
    this.game = this.gameUtils.give(this.game, player);
    this.podcast.notifyChanges();
  }

  public endCirlce(): void {
    this.game = this.gameUtils.endCirlce(this.game);
    this.podcast.notifyChanges();
  }

  public fillHands(): void {
    this.game = this.gameUtils.fillHands(this.game);
    this.podcast.notifyChanges();
  }

  public nextPlayer(): void {
    this.game = this.gameUtils.nextPlayer(this.game);
    this.podcast.notifyChanges();
  }

  public putOnTable(cards: Card[]): void {
    this.game = this.gameUtils.putOnTable(this.game, cards);
    this.podcast.notifyChanges();
  }
}
