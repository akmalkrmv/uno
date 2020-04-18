import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { BaseFirestoreService } from './base-firestore.service';
import { LocalStorageKeys } from '../../constants/local-storage-keys';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseFirestoreService {
  public userCollection: AngularFirestoreCollection<any>;
  public users$: Observable<any[]>;
  public path = 'users';

  constructor(private firestore: AngularFirestore) {
    super();

    this.userCollection = firestore.collection(this.path);
    this.users$ = this.withId(this.userCollection);
  }

  public createUser(name?: string): Observable<User> {
    return this.addToCollection(this.userCollection, { name }).pipe(
      map((id) => new User(id, name))
    );
  }

  public saveToken(userId: string, token: string) {
    const userRef = this.userCollection.doc(userId);
    const tokens = { [token]: true };
    userRef.update({ fcmTokens: tokens });
  }

  public authorize(): Observable<User> {
    let userId = localStorage.getItem(LocalStorageKeys.userId);

    if (userId) {
      return this.findById(userId).pipe(
        map((user) => new User(user.id, user.name))
      );
    }

    const name = prompt('Ваще имя: ');

    return this.createUser(name).pipe(
      tap((user) => localStorage.setItem(LocalStorageKeys.userId, user.id))
    );
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

  public update(user: User) {
    const userRef = this.firestore.doc(`users/${user.id}`).ref;
    return userRef.update({ ...user });
  }

  public remove(userId: string) {
    return this.firestore.doc(`users/${userId}`).ref.delete();
  }
}
