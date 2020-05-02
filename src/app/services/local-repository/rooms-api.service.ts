import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Room } from '@models/room';
import { BaseLocalStoreService } from './base-local-store.service';
import { LocalStorageCollection } from './local-storage-collection';

@Injectable({
  providedIn: 'root',
})
export class RoomsApiService extends BaseLocalStoreService {
  public roomsCollection: LocalStorageCollection<Room>;
  public rooms$: Observable<Room[]>;

  constructor() {
    super();

    this.roomsCollection = new LocalStorageCollection<Room>('rooms');
    this.rooms$ = this.collectionChanges('rooms');
  }

  public createRoom(creatorId: string): Observable<string> {
    const users = new LocalStorageCollection<any>('users');
    const creator = users.findById(creatorId);
    const room = {
      created: Date.now(),
      creator: creator,
      users: [creator],
    };

    return this.roomsCollection.add(room);
  }

  public update(room: Room) {
    return this.roomsCollection.update(room.id, room);
  }

  public remove(roomId: string) {
    return this.roomsCollection.remove(roomId);
  }
}
