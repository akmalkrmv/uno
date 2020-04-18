import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseFirestoreService } from './base-firestore.service';
import { Room, Offer, Answer, IOffer } from '../../models/room';

@Injectable({ providedIn: 'root' })
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
    return this.offersToUserId(userId, 'offers');
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.offersToUserId(userId, 'answers');
  }

  public createOffer(offer: Offer): Observable<string> {
    return this.createOfferByType(offer, 'offers');
  }

  public createAnswer(answer: Answer): Observable<string> {
    return this.createOfferByType(answer, 'answers');
  }

  public clearConnections(): Observable<any> {
    // const deleteEach = (array: QuerySnapshot<DocumentData>) =>
    //   array.forEach((item) => item.ref.delete());

    // return forkJoin(
    //   this.answerCollection.get().pipe(map((answers) => deleteEach(answers))),
    //   this.offerCollection.get().pipe(map((offers) => deleteEach(offers)))
    // );

    const deleteOffers = this.offers$.pipe(
      switchMap((changes) =>
        from(
          changes.map((change) =>
            this.firestore
              .doc(`${this.room.ref.path}/offers/${change.id}`)
              .delete()
          )
        )
      )
    );

    const deleteAnswers = this.answers$.pipe(
      switchMap((changes) =>
        from(
          changes.map((change) =>
            this.firestore
              .doc(`${this.room.ref.path}/answers/${change.id}`)
              .delete()
          )
        )
      )
    );
    return forkJoin(deleteAnswers, deleteOffers);
  }

  public findByUsers(
    userFrom: string,
    userTo: string,
    offerType: 'offers' | 'answers'
  ): Observable<IOffer> {
    const changes = offerType == 'offers' ? this.offers$ : this.answers$;

    return changes.pipe(
      map((items) =>
        items.find((item) => item.from == userFrom && item.to == userTo)
      )
    );
  }

  private offersToUserId(
    userId: string,
    offerType: 'offers' | 'answers'
  ): Observable<any[]> {
    const changes = offerType == 'offers' ? this.offers$ : this.answers$;

    return changes.pipe(
      map((items) =>
        items.filter((item) => item.to == userId && item.from != userId)
      )
    );
  }

  private createOfferByType<T extends IOffer>(
    payload: T,
    offerType: 'offers' | 'answers'
  ): Observable<string> {
    const collection =
      offerType == 'offers' ? this.offerCollection : this.answerCollection;

    return this.findByUsers(payload.from, payload.to, offerType).pipe(
      switchMap((existing) => {
        if (!existing) {
          const message = `from ${payload.from} to ${payload.to} does NOT exists`;
          console.log(typeof payload, message);

          return this.addToCollection(collection, payload);
        } else {
          const message = `from ${payload.from} to ${payload.to} ALREADY exists`;
          console.log(typeof payload, message);

          return of(null);

          // const path = `${this.room.ref.path}/${offerType}/${existing.id}`;
          // const doc = this.firestore.doc(path);
          // return from(doc.update({ description: payload.description })).pipe(
          //   map(() => existing.id)
          // );
        }
      })
    );
  }
}
