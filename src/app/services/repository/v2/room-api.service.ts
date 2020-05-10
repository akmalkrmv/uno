import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  QuerySnapshot,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { BaseFirestoreService } from '../base-firestore.service';
import {
  Room,
  Offer,
  Answer,
  IOffer,
  IceCandidate,
} from '../../../models/room';
import { IUser } from '@models/index';

@Injectable({ providedIn: 'root' })
export class RoomV2ApiService extends BaseFirestoreService {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  public init(roomId: string) {
    // this.room = this.firestore.doc<Room>(`rooms/${roomId}`);
    // this.userCollection = this.room.collection<any>('users');
    // this.offerCollection = this.room.collection<Offer>('offers');
    // this.answerCollection = this.room.collection<Answer>('answers');
    // this.iceCandidateCollection = this.room.collection<IceCandidate>(
    //   'ice-candidates'
    // );
    // this.users$ = this.collectionChanges(this.userCollection);
    // this.offers$ = this.collectionChanges(this.offerCollection, ['added']);
    // this.answers$ = this.collectionChanges(this.answerCollection, ['added']);
    // this.iceCandidates$ = this.collectionChanges(this.iceCandidateCollection, [
    //   'added',
    // ]);
  }

  public async exists(roomId: string): Promise<boolean> {
    const ref = this.firestore.doc<Room>(`rooms/${roomId}`).ref;
    const doc = await ref.get();
    return doc.exists;
  }

  public async createRoom(
    creator: string,
    data?: Partial<Room>
  ): Promise<string> {
    const roomId = await this.addToCollection(
      this.firestore.collection(`rooms`),
      { ...data, creator }
    );

    await this.joinRoom(roomId, creator);
    return roomId;
  }

  public async joinRoom(roomId: string, userId: string): Promise<void> {
    const colection = this.firestore.collection(`rooms/${roomId}/users`);
    await colection.add(userId);
  }

  public roomUsers(roomId: string): Observable<IUser[]> {
    return this.firestore
      .collection<string>(`rooms/${roomId}/users`)
      .valueChanges()
      .pipe(
        switchMap((userIds) => {
          return this.collectionChanges(
            this.firestore.collection<IUser>(`users`, (ref) =>
              ref.where('id', 'in', userIds)
            )
          );
        })
      );
  }

  // public otherUsers(userId: string): Observable<any[]> {
  //   return this.users$.pipe(
  //     map((users) => users.filter((user) => user.id != userId))
  //   );
  // }

  // public userOffers(userId: string): Observable<Offer[]> {
  //   return this.offersToUserId(userId, 'offers');
  // }

  // public userAnswers(userId: string): Observable<Answer[]> {
  //   return this.offersToUserId(userId, 'answers');
  // }

  // public createOffer(offer: Offer): Observable<string> {
  //   return this.createOfferByType(offer, 'offers');
  // }

  // public createAnswer(answer: Answer): Observable<string> {
  //   return this.createOfferByType(answer, 'answers');
  // }

  // public addIceCandidate(payload: IceCandidate): Observable<string> {
  //   return this.addToCollection(this.iceCandidateCollection, payload);
  // }

  // public userIceCandidates(userId: string): Observable<IceCandidate[]> {
  //   return this.iceCandidates$.pipe(
  //     map((items) =>
  //       items
  //         .filter((item) => item.recieverId == userId)
  //         .filter((item) => item.senderId != userId)
  //     )
  //   );
  // }

  // public clearConnections(): Observable<any> {
  //   const deleteEach = (array: QuerySnapshot<DocumentData>) =>
  //     array.forEach((item) => item.ref.delete());

  //   return forkJoin(
  //     this.offerCollection.get().pipe(map((items) => deleteEach(items))),
  //     this.answerCollection.get().pipe(map((items) => deleteEach(items))),
  //     this.iceCandidateCollection.get().pipe(map((items) => deleteEach(items)))
  //   );
  // }

  // public findByUsers(
  //   userFrom: string,
  //   userTo: string,
  //   offerType: 'offers' | 'answers'
  // ): Observable<IOffer> {
  //   const changes = offerType == 'offers' ? this.offers$ : this.answers$;

  //   return changes.pipe(
  //     map((items) =>
  //       items.find((item) => item.from == userFrom && item.to == userTo)
  //     )
  //   );
  // }

  // private offersToUserId(
  //   userId: string,
  //   offerType: 'offers' | 'answers'
  // ): Observable<any[]> {
  //   const changes = offerType == 'offers' ? this.offers$ : this.answers$;

  //   return changes.pipe(
  //     map((items) =>
  //       items.filter((item) => item.to == userId && item.from != userId)
  //     )
  //   );
  // }

  // private createOfferByType<T extends IOffer>(
  //   payload: T,
  //   offerType: 'offers' | 'answers'
  // ): Observable<string> {
  //   const collection =
  //     offerType == 'offers' ? this.offerCollection : this.answerCollection;

  //   return this.findByUsers(payload.from, payload.to, offerType).pipe(
  //     switchMap((existing) =>
  //       !existing ? this.addToCollection(collection, payload) : of(null)
  //     )
  //   );
  // }
}
