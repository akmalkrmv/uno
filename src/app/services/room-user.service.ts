import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  DocumentData,
} from 'angularfire2/firestore';
import { BaseFirestoreService } from './base-firestore.service';
import { RommUserMap } from '../models/room-user';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomUserService extends BaseFirestoreService {
  private collection: AngularFirestoreCollection<RommUserMap>;
  private maps$: Observable<RommUserMap[]>;
  private path = 'room-user-map';

  constructor(private firestore: AngularFirestore) {
    super();

    this.collection = firestore.collection(this.path);
    this.maps$ = this.withId(this.collection);
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
      tap((maps) => console.log(maps, roomId, userId)),
      map((maps) =>
        maps.find((value) => value.roomId == roomId && value.userId == userId)
      ),
      tap((map) => console.log(map))
    );
  }

  // UPDATE
  public joinRoom(roomId: string, userId: string): Observable<string> {
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
}
