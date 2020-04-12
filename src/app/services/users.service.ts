import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QueryDocumentSnapshot,
  DocumentData,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BaseFirestoreService } from './base-firestore.service';
import { LocalStorageKeys } from '../constants/local-storage-keys';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user';

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

  public async createUser(name?: string): Promise<User> {
    const created = await this.userCollection.add({ name });
    return new User(created.id, name);
  }

  public async authorize(): Promise<User> {
    let userId = localStorage.getItem(LocalStorageKeys.userId);

    if (userId) {
      const user = await this.findById(userId);
      if (user && user.exists) {
        return new User(user.id, user.data().name);
      }
    }

    const name = prompt('Ваще имя: ');
    const user = await this.createUser(name);
    localStorage.setItem(LocalStorageKeys.userId, user.id);

    return user;
  }

  public getByIds(userIds: string[]): Observable<any[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => userIds.includes(user.id)))
    );
  }

  public async findById(
    userId: string
  ): Promise<QueryDocumentSnapshot<DocumentData>> {
    return this.firestore.doc<User>(`${this.path}/${userId}`).get().toPromise();
  }
}
