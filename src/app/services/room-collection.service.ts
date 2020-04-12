import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Room } from '../models/room';
import { BaseFirestoreService } from './base-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class RoomCollectionService extends BaseFirestoreService {
  public roomsCollection: AngularFirestoreCollection<Room>;
  public rooms$: Observable<Room[]>;

  constructor(private firestore: AngularFirestore) {
    super();

    this.roomsCollection = firestore.collection('rooms');
    this.rooms$ = this.withId(this.roomsCollection);
  }

  public async createRoom(creatorId: string): Promise<string> {
    const creatorRef = this.firestore.doc(`users/${creatorId}`).ref;
    const room = await this.roomsCollection.add({
      creator: creatorRef,
      users: [creatorRef],
    });

    return room.id;
  }
}
