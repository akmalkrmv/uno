import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "angularfire2/firestore";
import { Room } from "../models/room";

@Injectable({
  providedIn: "root",
})
export class RoomCollectionService {
  public roomsCOllection: AngularFirestoreCollection<Room>;
  public rooms$: Observable<Room[]>;

  constructor(firestore: AngularFirestore) {
    this.roomsCOllection = firestore.collection("rooms");
    this.rooms$ = this.roomsCOllection.valueChanges();
  }

  public async createRoom(): Promise<string> {
    const room = await this.roomsCOllection.add({});
    return room.id;
  }
}
