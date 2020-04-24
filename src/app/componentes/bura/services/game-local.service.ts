import { Injectable } from '@angular/core';
import { GameEvent } from './game-api.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameLocalService {
  private channel = new BroadcastChannel('game_channel');

  constructor() {}

  create(event: GameEvent) {
    return of(null);
  }

  init(roomId: string) {
    return of(null);
  }
}
