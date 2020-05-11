import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentSnapshot,
  Action,
  DocumentChangeType,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

interface IChangeOptions {
  events?: Array<DocumentChangeType>;
  logItems?: boolean;
  logChanges?: boolean;
}

export class BaseFirestoreService {
  protected collectionChanges<T>(
    collection: AngularFirestoreCollection<T>,
    options: IChangeOptions = {}
  ): Observable<T[]> {
    return collection.snapshotChanges(options.events).pipe(
      tap(() => console.log(`list path: ${collection.ref.path}`)),
      tap((changes: DocumentChangeAction<T>[]) => {
        options.logChanges &&
          console.log(
            `${collection.ref.path}`,
            changes.map((change) => change.type)
          );
      }),
      map((changes: DocumentChangeAction<T>[]) =>
        changes.map((change: DocumentChangeAction<T>) => ({
          ...(change.payload.doc.data() as T),
          id: change.payload.doc.id,
        }))
      ),
      tap((items: T[]) => {
        options.logItems && console.log(`${collection.ref.path}`, items);
      })
    );
  }

  protected collectionStateChanges<T>(
    collection: AngularFirestoreCollection<T>,
    options: IChangeOptions = {}
  ): Observable<T[]> {
    return collection.stateChanges(options.events).pipe(
      tap(() => console.log(`list path: ${collection.ref.path}`)),
      tap((changes: DocumentChangeAction<T>[]) => {
        options.logChanges &&
          console.log(
            `${collection.ref.path}`,
            changes.map((change) => change.type)
          );
      }),
      map((changes: DocumentChangeAction<T>[]) =>
        changes.map((change: DocumentChangeAction<T>) => ({
          ...(change.payload.doc.data() as T),
          id: change.payload.doc.id,
        }))
      ),
      tap((items: T[]) => {
        options.logItems && console.log(`${collection.ref.path}`, items);
      })
    );
  }

  protected documentChanges<T>(
    document: AngularFirestoreDocument<T>,
    logItems = false,
    logChanges = false
  ): Observable<T> {
    return document.snapshotChanges().pipe(
      tap(() => console.log(`doc path: ${document.ref.path}`)),
      tap((change: Action<DocumentSnapshot<T>>) => {
        logChanges && console.log(`${document.ref.path} ${change.type}`);
      }),
      map((change: Action<DocumentSnapshot<T>>) => ({
        ...(change.payload.data() as T),
        id: change.payload.id,
      })),
      tap((item: T) => {
        logItems && console.log(`${document.ref.path}`, item);
      })
    );
  }

  protected async addToCollection<T>(
    collection: AngularFirestoreCollection<T>,
    payload: T
  ): Promise<string> {
    payload = { created: Date.now(), ...payload };
    const created = await collection.add(payload);
    return created.id;
  }

  protected async getCollectionOnce<T>(
    collection: AngularFirestoreCollection<T>
  ): Promise<T[]> {
    const snapshot = await collection.get().toPromise();
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  protected async getDocumentOnce<T>(
    document: AngularFirestoreDocument<T>
  ): Promise<T> {
    const snapshot = await document.get().toPromise();
    return snapshot.data() as T;
  }
}
