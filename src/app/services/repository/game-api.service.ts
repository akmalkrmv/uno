import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IGame } from 'src/app/modules/bura/models';
import { BaseFirestoreService } from './base-firestore.service';

const path = 'games';

@Injectable({ providedIn: 'root' })
export class GameApiService extends BaseFirestoreService {
  constructor(private firestore: AngularFirestore) {
    super();
  }

  public getRoomGame(payload: Partial<IGame>): Observable<IGame> {
    const gameDoc = this.getCollection(payload).doc<IGame>(payload.id);
    return this.documentChanges(gameDoc);
  }

  public create(payload: Partial<IGame>) {
    return this.addToCollection(this.getCollection(payload), payload);
  }

  public update(payload: Partial<IGame>): Promise<void> {
    return this.getCollection(payload).doc(payload.id).update(payload);
  }

  public remove(payload: Partial<IGame>): Promise<void> {
    return this.getCollection(payload).doc(payload.id).delete();
  }

  private getCollection({ roomId }: Partial<IGame>) {
    return this.firestore
      .collection(`rooms`)
      .doc(roomId)
      .collection<IGame>(path);
  }
}
