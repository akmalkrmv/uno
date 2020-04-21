import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFirestoreService } from '@services/repository/base-firestore.service';

export class Game {
  id?: string;
  players: any[];
  current: any[];
}
export class GameEvent {
  id?: string;
  action: string;
  payload: any;
}

@Injectable({ providedIn: 'root' })
export class GameApiService extends BaseFirestoreService {
  public collection: AngularFirestoreCollection<GameEvent>;
  public changes$: Observable<GameEvent[]>;
  public players$: Observable<any[]>;
  private path = 'games';

  constructor(private firestore: AngularFirestore) {
    super();
  }

  public init(roomId: string) {
    const doc = this.firestore.doc<Game>(`games/${roomId}`);
    const gameRef = doc.ref;

    this.players$ = this.documentChanges(doc).pipe(map((game) => game.players));

    return gameRef
      .get()
      .then((doc) => {
        doc.exists ? doc.id : gameRef.set({ id: roomId });
      })
      .then(() => {
        this.path = `games/${roomId}/events`;
        this.collection = this.firestore.collection<GameEvent>(this.path);
        this.changes$ = this.collectionChanges(this.collection);
      });
  }

  public join(roomId: string, playerId: string) {
    const gameRef = this.firestore.doc(`games/${roomId}`).ref;
    return gameRef.get().then((doc) => {
      const players: string[] = doc.data().players || [];
      if (!players.includes(playerId)) {
        gameRef.update({ players: [...players, playerId] });
      }
    });
  }

  
  public updateGame(roomId: string, payload: Game) {
    const ref = this.firestore.doc(`games/${roomId}`).ref;
    return ref.update({ ...payload });
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
