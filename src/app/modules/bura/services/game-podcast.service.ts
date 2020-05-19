import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subscription, BehaviorSubject, of } from 'rxjs';
import { first, catchError } from 'rxjs/operators';

import { IGame, IGameInitData } from '../models';
import { GameService } from './game.service';
import { ApiService } from '@services/repository/api.service';
import { IPodcastMessage } from '@models/podcast-message';

declare type Notifiable = IGame;

@Injectable({ providedIn: 'root' })
export class GamePodcastService {
  public changed$ = new EventEmitter();

  private channelId = 'game_channel';
  private channel = new BroadcastChannel(this.channelId);
  private subscriptions: Subscription[] = [];
  private gameService: GameService;
  private playerId: string;
  private isCreator: boolean;

  constructor(private api: ApiService) {}

  public async register(
    gameService: GameService,
    gameData: IGameInitData
  ): Promise<Notifiable> {
    this.gameService = gameService;
    this.channelId = gameData.roomId;
    this.playerId = gameData.playerId;
    this.isCreator = gameData.isCreator;

    // this.notifyChanges();
    // if (isCreator) this.notifyChanges();

    return new Promise((resolve, reject) => {
      // TODO: make factory for channel type
      //  -- LocalStorage events
      //  -- WebRTC DataChannel
      //  -- BroadcastChannel
      //  -- Firebase Cloud firestore
      //  -- Firebase Realtime database
      //
      //  1: BroadcastChannel:
      // this.channel.onmessage = (event: MessageEvent) =>
      //   this.handleMessages(event.data);
      //
      //  2: Firebase Realtime database:
      // const dummy = { action: 'create', notifier: playerId, payload: null };
      // this.channel_key = await this.api.podcast.create(dummy);
      this.subscriptions.push(
        this.api.podcast
          .getMessage(this.channelId)
          .pipe(catchError((error) => (reject(error), of(error))))
          .subscribe((podcast) => {
            this.handleMessages(podcast);
            resolve(podcast.payload);
          })
      );
      // ....
    });
  }

  public unsubscribeAll() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public notifyChanges() {
    // if (this.isCreator) {
    //   this.unsubscribeAll();
    // }

    const game = this.gameService;
    this.notify(game.game$, 'game$');
  }

  private notify(observable: Observable<Notifiable>, action: string) {
    const notifier = this.playerId;

    if (!this.isCreator) {
      observable = observable.pipe(first());
    }

    const subscription = observable.subscribe((payload) => {
      // this.channel.postMessage({ notifier, action, payload });
      this.api.podcast.update({
        id: this.channelId,
        created: Date.now(),
        notifier,
        action,
        payload,
      });
    });

    this.subscriptions.push(subscription);
  }

  private handleMessages(message: IPodcastMessage) {
    const game = this.gameService;
    const { action, payload, notifier } = message;

    if (notifier === this.playerId) return;
    if (!action) return;
    if (!payload) return;

    const subject: BehaviorSubject<any> = game[action];

    if (!subject) return;
    if (subject.value === payload) return;

    subject.next(payload);
    this.changed$.emit();
  }
}
