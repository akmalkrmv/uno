import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BaseFirestoreService } from './base-firestore.service';
import { LocalStorageKeys } from '../constants/local-storage-keys';

@Injectable({
  providedIn: 'root',
})
export class UsersService extends BaseFirestoreService {
  public userCollection: AngularFirestoreCollection<any>;
  public users$: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    super();

    this.userCollection = firestore.collection('users');
    this.users$ = this.withId(this.userCollection);
  }

  public async createUser(name?: string): Promise<string> {
    const created = await this.userCollection.add({ name });
    return created.id;
  }

  public async authorize(): Promise<string> {
    let userId = localStorage.getItem(LocalStorageKeys.userId);

    if (!userId) {
      const name = prompt('Ваще имя: ');
      userId = await this.createUser(name);
      localStorage.setItem(LocalStorageKeys.userId, userId);
    }

    return userId;
  }
}
