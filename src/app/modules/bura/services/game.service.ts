import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { GamePodcastService } from './game-podcast.service';
import { IGame, IPlayer, Card, IGameInitData } from '../models';
import { GameUtils } from '../utils/game-utils';

@Injectable({ providedIn: 'root' })
export class GameService {
  public game$ = new BehaviorSubject<IGame>(null);
  public changed$ = new EventEmitter<any>();
  private gameInitData: IGameInitData;

  private get game(): IGame {
    return this.game$.value;
  }

  private set game(value: IGame) {
    this.game$.next(value);
    this.changed$.emit(value);
    this.podcast.notifyChanges();
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

  public getPlayer(player: IPlayer): IPlayer {
    return this.gameUtils.getPlayer(this.game, player);
  }

  public createEmpty(): void {
    this.gameInitData = {
      ...this.gameInitData,
      state: 'empty',
      isCreator: true,
    };
    this.game = this.gameUtils.create(this.gameInitData);
  }

  public create(): void {
    this.gameInitData = { ...this.gameInitData, state: 'new', isCreator: true };
    this.game = this.gameUtils.create(this.gameInitData);
  }

  public join(player: IPlayer): void {
    this.game = this.gameUtils.join(this.game, player);
  }

  public start(): void {
    this.game = this.gameUtils.start(this.game);
  }

  public end(): void {
    this.game = this.gameUtils.end(this.game);
  }

  public selectCard(player: IPlayer, card: Card): void {
    this.game = this.gameUtils.selectCard(this.game, player, card);
  }

  public move(player: IPlayer): void {
    this.game = this.gameUtils.move(this.game, player);
  }

  public beat(player: IPlayer): void {
    this.game = this.gameUtils.beat(this.game, player);
  }

  public give(player: IPlayer): void {
    this.game = this.gameUtils.give(this.game, player);
  }

  public endCirlce(): void {
    this.game = this.gameUtils.endCirlce(this.game);
  }

  public fillHands(): void {
    this.game = this.gameUtils.fillHands(this.game);
  }

  public nextPlayer(): void {
    this.game = this.gameUtils.nextPlayer(this.game);
  }

  public putOnTable(cards: Card[]): void {
    this.game = this.gameUtils.putOnTable(this.game, cards);
  }
}
