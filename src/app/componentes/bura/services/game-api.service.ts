import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { BaseFirestoreService } from '@services/repository/base-firestore.service';

export class GameEvent {
  id?: string;
}

@Injectable({ providedIn: 'root' })
export class GameApiService extends BaseFirestoreService {
  public collection: AngularFirestoreCollection<GameEvent>;
  public changes$: Observable<GameEvent[]>;
  private path = 'game-events';

  constructor(private firestore: AngularFirestore) {
    super();
    this.collection = firestore.collection<GameEvent>(this.path);
    this.changes$ = this.collectionChanges(this.collection);
  }

  public create(data: GameEvent) {
    return this.addToCollection(this.collection, data);
  }

  public update(data: GameEvent) {
    const ref = this.firestore.doc(`${this.path}/${data.id}`).ref;
    return ref.update({ ...data });
  }

  public remove(id: string) {
    return this.firestore.doc(`${this.path}/${id}`).ref.delete();
  }
}
