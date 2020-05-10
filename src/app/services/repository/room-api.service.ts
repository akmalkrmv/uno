import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseFirestoreService } from './base-firestore.service';
import { Room } from '@models/room';
import { IUser } from '@models/index';

@Injectable({ providedIn: 'root' })
export class RoomApiService extends BaseFirestoreService {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  public async exists(roomId: string): Promise<boolean> {
    const ref = this.firestore.doc<Room>(`rooms/${roomId}`).ref;
    const doc = await ref.get();
    return doc.exists;
  }

  public async getById(roomId: string): Promise<Room> {
    const ref = this.firestore.doc<Room>(`rooms/${roomId}`).ref;
    const doc = await ref.get();
    return doc.data();
  }

  public createRoom(creator: string, data?: Partial<Room>): Promise<string> {
    return this.addToCollection(this.firestore.collection(`rooms`), {
      ...data,
      creator,
      users: [creator],
    });
  }

  public update(room: Room): Promise<void> {
    return this.firestore.doc(`rooms/${room.id}`).ref.update({ ...room });
  }

  public remove(roomId: string): Promise<void> {
    return this.firestore.doc(`rooms/${roomId}`).ref.delete();
  }

  public async joinRoom(roomId: string, userId: string): Promise<void> {
    const roomDoc = this.firestore.doc<Room>(`rooms/${roomId}`);
    const snapshot = await roomDoc.ref.get();

    if (!snapshot.exists) return;

    const room: Room = snapshot.data();
    if (room.users.indexOf(userId) < 0) {
      room.users.push(userId);
      await roomDoc.update(room);
    }
  }

  public async leaveRoom(roomId: string, userId: string): Promise<void> {
    const roomDoc = this.firestore.doc<Room>(`rooms/${roomId}`);
    const snapshot = await roomDoc.ref.get();

    if (!snapshot.exists) return;

    const room: Room = snapshot.data();
    const index = room.users.indexOf(userId);
    if (index >= 0) {
      room.users.splice(index, 1);
      await roomDoc.update(room);
    }
  }

  public roomUsers(roomId: string): Observable<IUser[]> {
    return this.firestore
      .doc<Room>(`rooms/${roomId}`)
      .valueChanges()
      .pipe(
        switchMap((room) => {
          return this.collectionChanges(
            this.firestore.collection<IUser>(`users`, (ref) =>
              ref.where('id', 'in', room.users)
            )
          );
        })
      );
  }

  public roomOtherUsers(roomId: string, userId: string): Observable<any[]> {
    return this.roomUsers(roomId).pipe(
      map((users) => users.filter((user) => user.id != userId))
    );
  }

  public userRooms(userId: string): Observable<Room[]> {
    return this.collectionChanges(
      this.firestore.collection<Room>(`rooms`, (ref) =>
        ref.where('users', 'array-contains', userId)
      )
    );
  }
}
