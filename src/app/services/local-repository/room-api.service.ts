import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Room, Offer, Answer, IOffer, IceCandidate } from '@models/room';
import { BaseLocalStoreService } from './base-local-store.service';
import {
  LocalStorageCollection,
  LocalStorageDocument,
} from './local-storage-collection';

@Injectable({ providedIn: 'root' })
export class RoomApiService extends BaseLocalStoreService {
  public room: LocalStorageDocument<Room>;

  public userCollection: LocalStorageCollection<any>;
  public offerCollection: LocalStorageCollection<Offer>;
  public answerCollection: LocalStorageCollection<Answer>;
  public iceCandidateCollection: LocalStorageCollection<IceCandidate>;

  public users$: Observable<any[]>;
  public offers$: Observable<Offer[]>;
  public answers$: Observable<Answer[]>;
  public iceCandidates$: Observable<IceCandidate[]>;

  constructor() {
    super();
  }

  public init(roomId: string) {
    this.room = new LocalStorageDocument<Room>(`rooms/${roomId}`);

    this.userCollection = this.room.collection<any>('users');
    this.offerCollection = this.room.collection<Offer>('offers');
    this.answerCollection = this.room.collection<Answer>('answers');
    this.iceCandidateCollection = this.room.collection<IceCandidate>(
      'ice-candidates'
    );

    this.users$ = this.collectionChanges(this.userCollection.path);
    this.offers$ = this.collectionChanges(this.offerCollection.path, 'added');
    this.answers$ = this.collectionChanges(this.answerCollection.path, 'added');
    this.iceCandidates$ = this.collectionChanges(
      this.iceCandidateCollection.path,
      'added'
    );
  }

  public exists(roomId: string): Observable<boolean> {
    const roomRef = new LocalStorageDocument<Room>(`rooms/${roomId}`);
    return of(roomRef.exists());
  }

  public joinRoom(userId: string): Observable<any> {
    const userRef = new LocalStorageDocument<any>(`users/${userId}`).item;
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

  public addIceCandidate(payload: IceCandidate) {
    return this.addToCollection(this.iceCandidateCollection, payload);
  }

  public userIceCandidates(userId: string): Observable<IceCandidate[]> {
    return this.iceCandidates$.pipe(
      map((items) =>
        items
          .filter((item) => item.recieverId == userId)
          .filter((item) => item.senderId != userId)
      )
    );
  }

  public clearConnections(): Observable<any> {
    return forkJoin(
      this.offerCollection.removeAll(),
      this.answerCollection.removeAll(),
      this.iceCandidateCollection.removeAll()
    );
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
      switchMap((existing) =>
        !existing ? this.addToCollection(collection, payload) : of(null)
      )
    );
  }
}
