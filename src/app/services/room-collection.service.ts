import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Room } from '../models/room';
import { BaseFirestoreService } from './base-firestore.service';
import { map } from 'rxjs/operators';

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

  public createRoom(creatorId: string): Observable<string> {
    const creatorRef = this.firestore.doc(`users/${creatorId}`).ref;
    const room = {
      creator: creatorRef,
      users: [creatorRef],
    };

    return from(this.roomsCollection.add(room)).pipe(
      map((created) => created.id)
    );
  }
}
