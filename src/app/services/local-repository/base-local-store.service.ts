import { Observable, fromEvent } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { LocalStorageCollection } from './local-storage-collection';

export class BaseLocalStoreService {

  protected collectionChanges<T>(
    collection: string,
    changeType?: string,
    logItems = false,
    logChanges = false
  ): Observable<T[]> {
    return fromEvent(window, 'storage').pipe(
      filter((event: StorageEvent) => event.key === collection),
      tap((event: StorageEvent) => logChanges && console.log(collection)),
      map((event: StorageEvent) => JSON.parse(event.newValue) as T[]),
      tap((items: T[]) => logItems && console.log(collection, items))
    );
  }

  protected documentChanges<T>(
    document: string,
    logItems = false,
    logChanges = false
  ): Observable<T> {
    return fromEvent(window, 'storage').pipe(
      filter((event: StorageEvent) => event.key === document),
      tap((event: StorageEvent) => logChanges && console.log(document)),
      map((event: StorageEvent) => JSON.parse(event.newValue) as T),
      tap((item: T) => logItems && console.log(document, item))
    );
  }

  protected addToCollection<T>(
    collection: LocalStorageCollection<T>,
    payload: T
  ): Observable<string> {
    return collection.add(payload);
  }
}
