import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Message } from '@models/index';
import { BaseLocalStoreService } from './base-local-store.service';
import { LocalStorageCollection } from './local-storage-collection';

@Injectable({ providedIn: 'root' })
export class MessagesApiService extends BaseLocalStoreService {
  public collection: LocalStorageCollection<Message>;
  public messages$: Observable<Message[]>;

  constructor() {
    super();
    this.collection = new LocalStorageCollection<Message>('messages');
    this.messages$ = this.collectionChanges('messages');
  }

  public create(payload: Message) {
    return this.addToCollection(this.collection, payload);
  }

  public update(data: Message) {
    return this.collection.update(data.id, data);
  }

  public remove(id: string) {
    return this.collection.remove(id);
  }
}
