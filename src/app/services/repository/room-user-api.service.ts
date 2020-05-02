import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { BaseFirestoreService } from './base-firestore.service';
import { RommUserMap } from '../../models/room-user';

@Injectable({
  providedIn: 'root',
})
export class RoomUserApiService extends BaseFirestoreService {
  public collection: AngularFirestoreCollection<RommUserMap>;
  public maps$: Observable<RommUserMap[]>;
  private path = 'room-user-map';

  constructor(private firestore: AngularFirestore) {
    super();

    this.collection = firestore.collection(this.path);
    this.maps$ = this.collectionChanges(this.collection);
  }

  // READ
  public roomUserIds(roomId: string): Observable<string[]> {
    return this.maps$
      .pipe(map((values) => values.filter((value) => value.roomId == roomId)))
      .pipe(map((values) => values.map((value) => value.userId)));
  }

  public userRoomIds(userId: string): Observable<string[]> {
    return this.maps$
      .pipe(map((values) => values.filter((value) => value.userId == userId)))
      .pipe(map((values) => values.map((value) => value.roomId)));
  }

  public roomOtherUserIds(roomId: string, userId: string) {
    return this.roomUserIds(roomId).pipe(
      map((ids) => ids.filter((id) => id != userId))
    );
  }

  public findByIds(roomId: string, userId: string): Observable<RommUserMap> {
    return this.maps$.pipe(
      map((maps) =>
        maps.find((value) => value.roomId == roomId && value.userId == userId)
      )
    );
  }

  // UPDATE
  public joinRoom(roomId: string, userId: string): Observable<string> {
    console.log('joinRoom ', roomId, userId);
    return this.findByIds(roomId, userId).pipe(
      switchMap((map) =>
        map
          ? of(map.id)
          : this.addToCollection(this.collection, { roomId, userId })
      )
    );
  }

  public leaveRoom(roomId: string, userId: string): Observable<any> {
    return this.findByIds(roomId, userId).pipe(
      switchMap((map) =>
        map ? this.firestore.doc(`${this.path}/${map.id}`).delete() : of(null)
      )
    );
  }

  // DELETE
  public removeByUserId(userId: string): Observable<any> {
    return this.maps$
      .pipe(map((values) => values.filter((value) => value.userId == userId)))
      .pipe(map((values) => values.map((value) => this.remove(value.id))));
  }

  public removeByRoomId(roomId: string): Observable<any> {
    return this.maps$
      .pipe(map((values) => values.filter((value) => value.roomId == roomId)))
      .pipe(map((values) => values.map((value) => this.remove(value.id))));
  }

  public remove(id: string) {
    return this.firestore.doc(`${this.path}/${id}`).ref.delete();
  }
}
