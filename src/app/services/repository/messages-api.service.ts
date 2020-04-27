import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseFirestoreService } from './base-firestore.service';
import { Message } from '@models/index';

import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessagesApiService extends BaseFirestoreService {
  public collection: AngularFirestoreCollection<Message>;
  public messages$: Observable<Message[]>;

  public messageList: AngularFireList<Message>;

  constructor(
    private firestore: AngularFirestore,
    private firedatabase: AngularFireDatabase
  ) {
    super();
    this.collection = firestore.collection<Message>('messages');
    this.messageList = firedatabase.list<Message>('/messages');

    this.messages$ = this.collectionChanges(this.collection);
    // this.messages$ = this.messageList
    //   .snapshotChanges()
    //   .pipe(map((changes) => changes.map((change) => {id: change.key})));
  }

  public create(payload: Message) {
    return this.addToCollection(this.collection, {
      ...payload,
      created: Date.now(),
    });
  }

  public update(data: Message) {
    const ref = this.firestore.doc(`messages/${data.id}`).ref;
    return ref.update({ ...data });
  }

  public remove(id: string) {
    return this.firestore.doc(`messages/${id}`).ref.delete();
  }
}
