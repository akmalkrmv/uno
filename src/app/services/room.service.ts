import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QuerySnapshot,
  DocumentData,
  DocumentReference,
} from 'angularfire2/firestore';
import { Observable, forkJoin, empty, from, of } from 'rxjs';
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

  public joinRoom(userId: string): Observable<any> {
    const userRef = this.firestore.doc(`users/${userId}`).ref;
    const result = this.users$.pipe(
      switchMap((users) => {
        const existing = users.find((user) => user == userRef);
        const created = this.userCollection.add({ ref: userRef });
        return existing == null ? from(created) : of(null);
      })
    );

    return result;
  }

  public otherUsers(userId: string): Observable<any[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => user.id != userId))
    );
  }

  public userOffers(userId: string): Observable<Offer[]> {
    return this.offersByType(userId, 'offers');
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.offersByType(userId, 'answers');
  }

  public createOffer(offer: Offer): Observable<string> {
    return this.createOfferByType(offer, 'offers');
  }

  public createAnswer(answer: Answer): Observable<string> {
    return this.createOfferByType(answer, 'answers');
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
  ): Observable<any[]> {
    const changes = offerType == 'offers' ? this.offers$ : this.answers$;

    return changes
      .pipe(map((items) => items.filter((item) => item.to == userId)))
      .pipe(map((items) => items.filter((item) => item.from != userId)));
  }

  private createOfferByType<T extends IOffer>(
    payload: T,
    offerType: 'offers' | 'answers'
  ): Observable<string> {
    const collection =
      offerType == 'offers' ? this.offerCollection : this.answerCollection;
    const changes = offerType == 'offers' ? this.offers$ : this.answers$;

    return changes
      .pipe(
        map((items) =>
          items.find(
            (item) => item.from == payload.from && item.to == payload.to
          )
        )
      )
      .pipe(
        switchMap((existing) => {
          if (!existing) {
            const message = `from ${payload.from} to ${payload.to} does NOT exists`;
            console.log(typeof payload, message, delimeter);

            return this.addToCollection(collection, payload);
          } else {
            const message = `from ${payload.from} to ${payload.to} ALREADY exists`;
            console.log(typeof payload, message, delimeter);

            const doc = this.firestore.doc(
              `${this.room.ref.path}/${offerType}/${existing.id}`
            );

            return from(doc.update({ ...payload })).pipe(
              map(() => existing.id)
            );
          }
        })
      );
  }
}
