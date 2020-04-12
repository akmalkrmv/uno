import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  DocumentData,
} from 'angularfire2/firestore';
import { BaseFirestoreService } from './base-firestore.service';
import { RommUserMap } from '../models/room-user';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomUserService extends BaseFirestoreService {
  private collection: AngularFirestoreCollection<RommUserMap>;
  private path = 'room-user-map';

  constructor(private firestore: AngularFirestore) {
    super();

    this.collection = firestore.collection(this.path);
  }

  // READ
  public roomUserIds(roomId: string): Observable<string[]> {
    return this.firestore
      .collection<RommUserMap>(this.path, (ref) =>
        ref.where('roomId', '==', roomId)
      )
      .valueChanges()
      .pipe(map((values) => values.map((value) => value.userId)));
  }

  public userRoomIds(userId: string): Observable<string[]> {
    return this.firestore
      .collection<RommUserMap>(this.path, (ref) =>
        ref.where('userId', '==', userId)
      )
      .valueChanges()
      .pipe(map((values) => values.map((value) => value.roomId)));
  }

  public roomOtherUserIds(roomId: string, userId: string) {
    return this.roomUserIds(roomId).pipe(
      map((ids) => ids.filter((id) => id != userId))
    );
  }

  public async findByIds(
    roomId: string,
    userId: string
  ): Promise<QueryDocumentSnapshot<DocumentData>> {
    const query = this.firestore.collection<RommUserMap>(this.path, (ref) =>
      ref.where('roomId', '==', roomId).where('userId', '==', userId)
    );

    const collection = await query.get().toPromise();
    return collection.docs[0];
  }

  // UPDATE
  public async joinRoom(roomId: string, userId: string) {
    const snapshot = await this.findByIds(roomId, userId);

    if (!snapshot || !snapshot.exists) {
      this.collection.add({ roomId, userId });
    }
  }

  public async leaveRoom(roomId: string, userId: string) {
    const snapshot = await this.findByIds(roomId, userId);

    if (snapshot && snapshot.exists) {
      snapshot.ref.delete();
    }
  }
}
