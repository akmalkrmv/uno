import { Injectable, EventEmitter } from '@angular/core';
import { of, Observable, Subscription, BehaviorSubject } from 'rxjs';

import { GameService } from './game.service';
import { Player, PlayerMapper } from '../models/player';
import { Card } from '../models/card.model';
import { take } from 'rxjs/operators';

declare type Notifiable =
  | Array<Player | Card>
  | Player
  | Card
  | string
  | number;

@Injectable({
  providedIn: 'root',
})
export class GameLocalService {
  public changed$ = new EventEmitter();

  private channel = new BroadcastChannel('game_channel');
  private subscriptions: Subscription[] = [];
  private game: GameService;
  private playerId: string;
  private isCreator: boolean;

  constructor() {}

  public register(game: GameService, playerId: string, isCreator = false) {
    this.game = game;
    this.playerId = playerId;
    this.isCreator = isCreator;

    this.channel.onmessage = (event: MessageEvent) =>
      this.handleMessages(event);

    // if (isCreator) this.notifyChanges();
    this.notifyChanges();
  }

  public unsubscribeAll() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  public notifyChanges() {
    if (this.isCreator) {
      this.unsubscribeAll();
    }

    const game = this.game;
    this.notify(game.players$, 'players$');
    this.notify(game.current$, 'current$');
    this.notify(game.beater$, 'beater$');

    this.notify(game.deck$, 'deck$');
    this.notify(game.table$, 'table$');
    this.notify(game.trump$, 'trump$');
    this.notify(game.beatingCards$, 'beatingCards$');

    this.notify(game.state$, 'state$');
    this.notify(game.moves$, 'moves$');
  }

  private notify(observable: Observable<Notifiable>, action: string) {
    const notifier = this.playerId;

    if (!this.isCreator) {
      observable = observable.pipe(take(1));
    }

    const subscription = observable.subscribe((payload) => {
      let mapped: any = payload;

      if (payload instanceof Array) {
        mapped = payload.map((item: Player | Card) =>
          item instanceof Player ? PlayerMapper.flaten(item) : item
        );
      }

      if (payload instanceof Player) {
        mapped = PlayerMapper.flaten(payload);
      }

      this.channel.postMessage({ notifier, action, payload: mapped });
    });

    this.subscriptions.push(subscription);
  }

  private handleMessages(event: MessageEvent) {
    const game = this.game;
    const { action, payload, notifier } = event.data;

    if (notifier === this.playerId) return;
    if (!action) return;
    if (!payload) return;

    const subject: BehaviorSubject<any> = game[action];

    if (!subject) return;
    if (subject.value === payload) return;

    let mapped: any = payload;
    const mapper = (item: any) =>
      typeof item === 'object' && 'isMapped' in item
        ? PlayerMapper.fromflat(item)
        : item;

    if (payload instanceof Array) {
      mapped = payload.map(mapper);
    } else {
      mapped = mapper(payload);
    }

    subject.next(mapped);
    this.changed$.emit();
  }
}
