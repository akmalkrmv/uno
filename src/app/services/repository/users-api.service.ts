import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { IUser } from '@models/index';
import { BaseFirestoreService } from './base-firestore.service';
import { IUsersApiService } from '@interfaces/repository';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService extends BaseFirestoreService {
  private collection: AngularFirestoreCollection<IUser>;
  private path = 'users';

  constructor(private firestore: AngularFirestore) {
    super();
    this.collection = firestore.collection<IUser>(this.path);
  }

  public getAll(): Observable<IUser[]> {
    return this.collectionChanges(this.firestore.collection<IUser>(`users`));
  }

  public getByIds(users: string[]): Observable<IUser[]> {
    return this.collectionChanges(
      this.firestore.collection<IUser>(`users`, (ref) =>
        ref.where('id', 'in', users)
      )
    );
  }

  public getFreinds(userId: string): Observable<IUser[]> {
    return this.firestore
      .doc<IUser>(`${this.path}/${userId}`)
      .get()
      .pipe(
        map((doc) => doc.data()),
        switchMap((user: IUser) =>
          user.friends && user.friends.length
            ? this.getByIds(user.friends)
            : of([])
        )
      );
  }

  public findById(userId: string): Observable<IUser> {
    return this.documentChanges(this.firestore.doc(`users/${userId}`));
  }

  public async addIfNotExists(user: IUser): Promise<void> {
    const userRef = this.firestore.doc(`users/${user.id}`).ref;
    const doc = await userRef.get();
    if (!doc.exists) {
      user = { ...user, created: Date.now() };
      userRef.set(user, { merge: true });
    }
  }

  public async addToFriends(
    userId: string,
    ...freindIds: string[]
  ): Promise<void> {
    const userRef = this.firestore.doc(`users/${userId}`).ref;
    const doc = await userRef.get();
    if (doc.exists) {
      const user: IUser = doc.data();
      const friends: string[] = user.friends || [];

      freindIds.forEach(
        (friend) => !friends.includes(friend) && friends.push(friend)
      );

      return userRef.update({ friends });
    }
  }

  public saveToken(userId: string, token: string) {
    const userRef = this.collection.doc(userId);
    const tokens = { [token]: true };
    return userRef.update({ fcmTokens: tokens });
  }

  public update(user: Partial<IUser>): Promise<void> {
    return this.firestore.doc(`users/${user.id}`).update({ ...user });
  }

  public remove(userId: string): Promise<void> {
    return this.firestore.doc(`users/${userId}`).delete();
  }
}
