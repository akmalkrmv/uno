import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseFirestoreService } from './base-firestore.service';
import { Message } from '@models/index';

@Injectable({ providedIn: 'root' })
export class MessagesApiService extends BaseFirestoreService {
  public collection: AngularFirestoreCollection<Message>;
  public messages$: Observable<Message[]>;

  constructor(private firestore: AngularFirestore) {
    super();
    this.collection = firestore.collection<Message>('messages');
    this.messages$ = this.collectionChanges(this.collection);
  }

  public create(payload: Message) {
    return this.addToCollection(this.collection, payload);
  }

  public update(data: Message) {
    const ref = this.firestore.doc(`messages/${data.id}`).ref;
    return ref.update({ ...data });
  }

  public remove(id: string) {
    return this.firestore.doc(`messages/${id}`).ref.delete();
  }
}
