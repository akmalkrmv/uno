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
  private collection: AngularFirestoreCollection<Message>;

  constructor(private firestore: AngularFirestore) {
    super();
    this.collection = firestore.collection<Message>('messages');
  }

  public roomMessages(roomId: string): Observable<Message[]> {
    const collection = this.firestore.collection<Message>('messages', (ref) =>
      ref.where('roomId', '==', roomId).orderBy('created', 'desc').limit(30)
    );
    return this.collectionChanges(collection);
  }

  public create(payload: Message) {
    this.firestore.doc(`rooms/${payload.roomId}`).update({
      id: payload.roomId,
      lastMessage: `${payload.sender.name}: ${payload.content}`,
      updated: Date.now(),
    });
    
    return this.addToCollection(this.collection, payload);
  }

  public update(data: Message) {
    return this.firestore.doc(`messages/${data.id}`).update({ ...data });
  }

  public remove(id: string) {
    return this.firestore.doc(`messages/${id}`).delete();
  }
}
