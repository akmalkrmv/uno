import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QuerySnapshot,
  DocumentData,
} from 'angularfire2/firestore';
import { Observable, forkJoin, empty, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseFirestoreService } from './base-firestore.service';
import { Room, Offer, Answer, IOffer } from '../models/room';
import { delimeter } from '../constants/logging';

@Injectable({
  providedIn: 'root',
})
export class RoomService extends BaseFirestoreService {
  public room: AngularFirestoreDocument<Room>;
  public userCollection: AngularFirestoreCollection<any>;
  public offerCollection: AngularFirestoreCollection<Offer>;
  public answerCollection: AngularFirestoreCollection<Answer>;
  public users$: Observable<any[]>;
  public offers$: Observable<Offer[]>;
  public answers$: Observable<Answer[]>;

  constructor(private firestore: AngularFirestore) {
    super();
  }

  public init(roomId: string) {
    this.room = this.firestore.doc<Room>(`rooms/${roomId}`);

    this.userCollection = this.room.collection<any>('users');
    this.offerCollection = this.room.collection<Offer>('offers');
    this.answerCollection = this.room.collection<Answer>('answers');

    this.users$ = this.withId(this.userCollection);
    this.offers$ = this.withId(this.offerCollection);
    this.answers$ = this.withId(this.answerCollection);
  }

  public async joinRoom(userId: string): Promise<void> {
    const userRef = this.firestore.doc(`users/${userId}`).ref;
    const collection = this.room.collection<any>('users', (ref) =>
      ref.where('ref', '==', userRef)
    );

    const users = await collection.get().toPromise();
    console.log(userId, users, users.docs);

    if (users.empty) {
      collection.add({ ref: userRef });
    }
  }

  public userJoined(roomId: string): Observable<any> {
    return this.firestore.collection(`rooms/${roomId}/users`).snapshotChanges();
  }

  /** obsolete */
  public otherUsers(userId: string): Observable<any[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => user.id != userId))
    );
  }

  public userOffers(userId: string): Observable<Offer[]> {
    return this.offersByType<Offer>(userId, 'offers');
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.offersByType<Answer>(userId, 'answers');
  }

  public createOffer(offer: Offer): Promise<any> {
    return this.createOfferByType(offer, 'offers').toPromise();
  }

  public createAnswer(answer: Answer): Promise<any> {
    return this.createOfferByType(answer, 'answers').toPromise();
  }

  public clearConnections(): Observable<any> {
    const deleteEach = (array: QuerySnapshot<DocumentData>) =>
      array.forEach((item) => item.ref.delete());

    return forkJoin(
      this.offerCollection.get().pipe(map((offers) => deleteEach(offers))),
      this.answerCollection.get().pipe(map((answers) => deleteEach(answers)))
    );
  }

  private offersByType<T extends IOffer>(
    userId: string,
    offerType: 'offers' | 'answers'
  ): Observable<T[]> {
    const query = this.room.collection<T>(offerType, (ref) =>
      ref.where('to', '==', userId)
    );

    return this.withId<T>(query).pipe(
      map((items) => items.filter((item) => item.from != userId))
    );
  }

  private createOfferByType<T extends IOffer>(
    payload: T,
    offerType: 'offers' | 'answers'
  ): Observable<any> {
    const collection = this.room.collection<T>(
      offerType,
      (ref) =>
        ref.where('from', '==', payload.from) &&
        ref.where('to', '==', payload.to)
    );

    return collection.get().pipe(
      switchMap((items) => {
        if (items.empty) {
          const message = `from ${payload.from} to ${payload.to} does NOT exists`;
          console.log(typeof payload, message, delimeter);

          return from(collection.add(payload)).pipe(
            switchMap((created) => created.id)
          );
        } else {
          const message = `from ${payload.from} to ${payload.to} ALREADY exists`;
          console.log(typeof payload, message, delimeter);

          return empty();
        }
      })
    );
  }
}
