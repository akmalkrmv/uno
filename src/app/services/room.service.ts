import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "angularfire2/firestore";
import { Room, Offer, Answer } from "../models/room";
import { map } from "rxjs/operators";
import { delimeter } from "../constants/logging";

@Injectable({
  providedIn: "root",
})
export class RoomService {
  public room: AngularFirestoreDocument<Room>;
  public userCollection: AngularFirestoreCollection<any>;
  public offerCollection: AngularFirestoreCollection<Offer>;
  public answerCollection: AngularFirestoreCollection<Answer>;
  public users$: Observable<any[]>;
  public offers$: Observable<Offer[]>;
  public answers$: Observable<Answer[]>;

  constructor(private firestore: AngularFirestore) {}

  public init(roomId: string) {
    this.room = this.firestore.doc(`rooms/${roomId}`);

    this.userCollection = this.room.collection<any>("users");
    this.offerCollection = this.room.collection<Offer>("offers");
    this.answerCollection = this.room.collection<Answer>("answers");

    this.users$ = this.userCollection.valueChanges();
    this.offers$ = this.offerCollection.valueChanges();
    this.answers$ = this.answerCollection.valueChanges();
  }

  public async joinRoom(roomId: string): Promise<string> {
    const id = this.firestore.createId();
    await this.firestore.collection(`rooms/${roomId}/users`).add({ id });
    return id;
  }

  public userJoined(roomId: string): Observable<any> {
    return this.firestore.collection(`rooms/${roomId}/users`).snapshotChanges();
  }

  public otherUsers(userId: string): Observable<any[]> {
    return this.users$.pipe(
      map((users) => users.filter((user) => user.id != userId))
    );
  }

  public userOffers(userId: string): Observable<Offer[]> {
    return this.room
      .collection<Offer>("offers", (ref) => ref.where("to", "==", userId))
      .valueChanges()
      .pipe(map((offers) => offers.filter((offer) => offer.from != userId)));
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.room
      .collection<Answer>("answers", (ref) => ref.where("to", "==", userId))
      .valueChanges()
      .pipe(
        map((answers) => answers.filter((answer) => answer.from != userId))
      );
  }

  public async createOffer(offer: Offer): Promise<string> {
    const existing = await this.room
      .collection<Offer>(
        "offers",
        (ref) =>
          ref.where("from", "==", offer.from) && ref.where("to", "==", offer.to)
      )
      .get()
      .toPromise();

    if (!existing.empty) {
      const log = `Offer from ${offer.from} to ${offer.to} already exists`;
      console.log(log, delimeter);
      return;
    }

    const id = this.firestore.createId();
    await this.offerCollection.add({ ...offer, id });
    return id;
  }

  public async createAnswer(answer: Answer): Promise<string> {
    const existing = await this.room
      .collection<Answer>(
        "answers",
        (ref) =>
          ref.where("from", "==", answer.from) &&
          ref.where("to", "==", answer.to)
      )
      .get()
      .toPromise();

    if (!existing.empty) {
      const log = `Offer from ${answer.from} to ${answer.to} already exists`;
      console.log(log, delimeter);
      return;
    }

    const id = this.firestore.createId();
    await this.answerCollection.add({ ...answer, id });
    return id;
  }

  public async clearConnections() {
    const room = await this.room.ref.get();
    await this.room.update({ ...room.data(), offers: [], answers: [] });
  }
}
