import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { BaseFirestoreService } from './base-firestore.service';
import { RommUserMap } from '../models/room-user';

@Injectable({
  providedIn: 'root',
})
export class RoomUserService extends BaseFirestoreService {
  public roomUserCollection: AngularFirestoreCollection<RommUserMap>;

  constructor(private firestore: AngularFirestore) {
    super();

    this.roomUserCollection = firestore.collection('room-user-map');
  }

  public roomUsers(roomId: string) {
    this.firestore.collection('room-user-map', (ref) =>
      ref.where('roomId', '==', roomId)
    );
  }
}
