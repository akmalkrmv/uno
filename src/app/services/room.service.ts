import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "angularfire2/firestore";
import { User } from "../models/user";
import { Room, Offer, Answer } from "../models/room";
import { map } from "rxjs/operators";

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
    const created = await this.firestore
      .collection(`rooms/${roomId}/users`)
      .add({});

    await created.update({ id: created.id });
    return created.id;
  }

  public userJoined(roomId: string): Observable<any> {
    return this.firestore.collection(`rooms/${roomId}/users`).snapshotChanges();
  }

  public userOffers(userId: string): Observable<Offer[]> {
    return this.room
      .collection<Offer>("offers", (ref) => ref.where("to", "==", userId))
      .valueChanges();
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.room
      .collection<Answer>("answers", (ref) => ref.where("to", "==", userId))
      .valueChanges();
  }

  public async createOffer(offer: Offer): Promise<string> {
    const existing = this.room.collection<Offer>(
      "offers",
      (ref) =>
        ref.where("from", "==", offer.from) && ref.where("to", "==", offer.to)
    );

    if (existing) {
      const epired = await existing.get().toPromise();
      epired.forEach((doc) => doc.ref.delete());
    }

    const created = await this.offerCollection.add(offer);
    await created.update({ id: created.id });
    return created.id;
  }

  public async createAnswer(answer: Answer): Promise<string> {
    const existing = this.room.collection<Offer>(
      "answers",
      (ref) =>
        ref.where("from", "==", answer.from) && ref.where("to", "==", answer.to)
    );

    if (existing) {
      const epired = await existing.get().toPromise();
      epired.forEach((doc) => doc.ref.delete());
    }

    const created = await this.answerCollection.add(answer);
    await created.update({ id: created.id });
    return created.id;
  }
}
