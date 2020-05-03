import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '@models/user';
import { BaseFirestoreService } from './base-firestore.service';

@Injectable({
  providedIn: 'root',
})
export class UsersApiService extends BaseFirestoreService {
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

  public findById(userId: string): Observable<User> {
    return this.users$.pipe(
      map((users) => users.find((user) => user.id == userId))
    );
  }

  public addOrUpdate(user: any): Promise<void> {
    const userRef = this.firestore.doc(`users/${user.id}`).ref;
    return userRef.get().then((user) => {
      return user.exists
        ? userRef.update({ ...user })
        : userRef.set({ ...user, created: Date.now() }, { merge: true });
    });
  }

  public update(user: User) {
    const userRef = this.firestore.doc(`users/${user.id}`).ref;
    return userRef.update({ ...user });
  }

  public remove(userId: string) {
    return this.firestore.doc(`users/${userId}`).ref.delete();
  }
}
