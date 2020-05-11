import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { BaseFirestoreService } from './base-firestore.service';
import { IceCandidate } from '@models/room';
import { IOffer } from '@models/index';

@Injectable({ providedIn: 'root' })
export class OfferApiService extends BaseFirestoreService {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  public userOffers(roomId: string, userId: string): Observable<IOffer[]> {
    const collection = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) => ref.where('receiver', '==', userId).where('type', '==', 'offer')
    );
    return this.collectionStateChanges(collection, { events: ['added'] });
  }

  public userAnswers(roomId: string, userId: string): Observable<IOffer[]> {
    const collection = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) => ref.where('receiver', '==', userId).where('type', '==', 'answer')
    );
    return this.collectionStateChanges(collection, { events: ['added'] });
  }

  public userDisconnections(
    roomId: string,
    userId: string
  ): Observable<IOffer[]> {
    const collection = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) => ref.where('receiver', '==', userId)
    );

    return this.collectionStateChanges(collection, { events: ['removed'] });
  }

  public async createOffer(roomId: string, offer: IOffer): Promise<void> {
    const collection = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) =>
        ref
          .where('type', '==', offer.type)
          .where('sender', '==', offer.sender)
          .where('receiver', '==', offer.receiver)
    );

    const data = await this.getCollectionOnce(collection);

    if (!data || !data.length) {
      this.addToCollection(collection, offer);
    }
  }

  public addIceCandidate(
    roomId: string,
    payload: IceCandidate
  ): Promise<string> {
    return this.addToCollection(
      this.firestore.collection<IceCandidate>(`rooms/${roomId}/ice-candidates`),
      payload
    );
  }

  public userIceCandidates(
    roomId: string,
    userId: string
  ): Observable<IceCandidate[]> {
    const collection = this.firestore.collection<IceCandidate>(
      `rooms/${roomId}/ice-candidates`,
      (ref) => ref.where('receiver', '==', userId)
    );

    return this.collectionChanges(collection);
  }

  public clearConnections(roomId: string, userId: string): Promise<any> {
    const deleteDocuments = (collection: AngularFirestoreCollection) =>
      collection
        .get()
        .toPromise()
        .then((snapshot: QuerySnapshot<DocumentData>) =>
          snapshot.forEach((item) => item.ref.delete())
        );

    const sendOffers = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) => ref.where('sender', '==', userId)
    );
    const receivedOffers = this.firestore.collection<IOffer>(
      `rooms/${roomId}/offers`,
      (ref) => ref.where('receiver', '==', userId)
    );

    const sendIceCandidates = this.firestore.collection<IceCandidate>(
      `rooms/${roomId}/ice-candidates`,
      (ref) => ref.where('sender', '==', userId)
    );
    const receivedIceCandidates = this.firestore.collection<IceCandidate>(
      `rooms/${roomId}/ice-candidates`,
      (ref) => ref.where('receiver', '==', userId)
    );

    return Promise.all([
      deleteDocuments(sendOffers),
      deleteDocuments(receivedOffers),
      deleteDocuments(sendIceCandidates),
      deleteDocuments(receivedIceCandidates),
    ]);
  }
}
