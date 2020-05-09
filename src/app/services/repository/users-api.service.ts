import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { User } from '@models/user';
import { BaseFirestoreService } from './base-firestore.service';
import { IUsersApiService } from '@interfaces/repository';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService extends BaseFirestoreService
  implements IUsersApiService {
  public userCollection: AngularFirestoreCollection<any>;
  public users$: Observable<any[]>;
  public path = 'users';

  constructor(private firestore: AngularFirestore) {
    super();

    this.userCollection = firestore.collection(this.path);
    this.users$ = this.collectionChanges(this.userCollection);
  }

  public createUser(name?: string): Observable<User> {
    return this.addToCollection(this.userCollection, { name }).pipe(
      map((id) => new User(id, name))
    );
  }

  public saveToken(userId: string, token: string) {
    const userRef = this.userCollection.doc(userId);
    const tokens = { [token]: true };
    return userRef.update({ fcmTokens: tokens });
  }

  public getByIds(userIds: string[]): Observable<User[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => userIds.includes(user.id)))
    );
  }

  public getFreinds(userId: string): Observable<User[]> {
    return this.firestore
      .doc<User>(`${this.path}/${userId}`)
      .get()
      .pipe(
        switchMap((doc) => {
          const user = doc.data();

          return user.friends && user.friends.length
            ? this.collectionChanges(
                this.firestore.collection<User>(this.path, (ref) =>
                  ref.where('id', 'in', user.friends)
                )
              )
            : of([]);
        })
      );
  }

  public findById(userId: string): Observable<User> {
    return this.users$.pipe(
      map((users) => users.find((user) => user.id == userId))
    );
  }

  public async addIfNotExists(user: any): Promise<void> {
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
      const user = doc.data();
      const friends: string[] = user.freinds || [];

      freindIds.forEach(
        (friend) => !friends.includes(friend) && friends.push(friend)
      );

      return userRef.update({ friends });
    }
  }

  public update(user: Partial<User>) {
    const userRef = this.firestore.doc(`users/${user.id}`).ref;
    return userRef.update({ ...user });
  }

  public remove(userId: string) {
    return this.firestore.doc(`users/${userId}`).ref.delete();
  }
}
