import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Room } from '../../models/room';
import { BaseFirestoreService } from './base-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class RoomsApiService extends BaseFirestoreService {
  public roomsCollection: AngularFirestoreCollection<Room>;
  public rooms$: Observable<Room[]>;

  constructor(private firestore: AngularFirestore) {
    super();

    this.roomsCollection = firestore.collection('rooms');
    this.rooms$ = this.collectionChanges(this.roomsCollection);
  }

  public createRoom(
    creatorId: string,
    data?: Partial<Room>
  ): Observable<string> {
    return this.addToCollection(this.roomsCollection, {
      ...data,
      creator: creatorId,
    });
  }

  public update(room: Room) {
    const roomRef = this.firestore.doc(`rooms/${room.id}`).ref;
    return roomRef.update({ ...room });
  }

  public remove(roomId: string) {
    return this.firestore.doc(`rooms/${roomId}`).ref.delete();
  }
}
