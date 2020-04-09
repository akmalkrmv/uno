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
    const reference = await this.firestore
      .collection(`rooms/${roomId}/users`)
      .add({});

    await reference.set({ id: reference.id });
    return reference.id;
  }

  public userJoined(roomId: string): Observable<any> {
    return this.firestore
      .collection(`rooms/${roomId}/users`)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          changes
            .filter((change) => change.type === "added")
            .map((change) => change.payload);
        })
      );
  }

  public userOffers(userId: string): Observable<Offer[]> {
    return this.room
      .collection<Offer>("offers", (ref) => ref.where("to", "==", userId))
      .valueChanges();
  }

  public userAnswers(userId: string): Observable<Answer[]> {
    return this.room
      .collection<Answer>("answer", (ref) => ref.where("to", "==", userId))
      .valueChanges();
  }

  public async createOffer(offer: Offer): Promise<string> {
    const created = await this.offerCollection.add(offer);
    await created.set({ id: created.id });
    return created.id;
  }

  public async createAnswer(answer: Answer): Promise<string> {
    const created = await this.answerCollection.add(answer);
    await created.set({ id: created.id });
    return created.id;
  }
}
