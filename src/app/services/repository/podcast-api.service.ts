import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';

import { IPodcastMessage } from '@models/podcast-message';
import { BaseFirestoreService } from './base-firestore.service';
import { map } from 'rxjs/operators';

const path = 'podcast';

@Injectable({ providedIn: 'root' })
export class PodcastApiService extends BaseFirestoreService {
  constructor(private firedb: AngularFireDatabase) {
    super();
  }

  public getMessage(id: string): Observable<IPodcastMessage> {
    return this.firedb
      .object<IPodcastMessage>(`${path}/${id}`)
      .snapshotChanges()
      .pipe(
        map((snapshot) => ({ id: snapshot.key, ...snapshot.payload.val() }))
      );
  }

  public async create(payload: IPodcastMessage) {
    const created = await this.firedb
      .list<IPodcastMessage>(`${path}`)
      .push({ created: Date.now(), ...payload });

    return created.key;
  }

  public update(payload: Partial<IPodcastMessage>): Promise<void> {
    return this.firedb.database
      .ref(`${path}/${payload.id}`)
      .transaction((podcast) =>
        podcast && podcast.created > payload.created ? podcast : payload
      );

    // return this.firedb.object(`${path}/${payload.id}`).update(payload);
  }

  public remove(id: string): Promise<void> {
    return this.firedb.object(`${path}/${id}`).remove();
  }
}
