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
import * as firebase from 'firebase/app';

interface IChangeOptions {
  events?: Array<DocumentChangeType>;
  logItems?: boolean;
  logChanges?: boolean;
}

const trace = (...params: any) => {
  console.log(params);
  firebase.performance().trace(params[0]);
};
const traceIf = (condition: boolean, ...params: any) => {
  condition && trace(...params);
};

export class BaseFirestoreService {
  protected collectionChanges<T>(
    collection: AngularFirestoreCollection<T>,
    options: IChangeOptions = {}
  ): Observable<T[]> {
    return collection
      .snapshotChanges(options.events)
      .pipe(this.map<T>(collection, options));
  }

  protected collectionStateChanges<T>(
    collection: AngularFirestoreCollection<T>,
    options: IChangeOptions = {}
  ): Observable<T[]> {
    return collection
      .snapshotChanges(options.events)
      .pipe(this.map<T>(collection, options));
  }

  protected documentChanges<T>(
    document: AngularFirestoreDocument<T>,
    logItems = false,
    logChanges = false
  ): Observable<T> {
    return document.snapshotChanges().pipe(
      tap(() => trace(document.ref.path)),
      tap((change) => traceIf(logChanges, document.ref.path, change.type)),
      map((change: Action<DocumentSnapshot<T>>) => ({
        id: change.payload.id,
        ...(change.payload.data() as T),
      })),
      tap((item: T) => traceIf(logItems, document.ref.path, item))
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

  private map<T>(
    collection: AngularFirestoreCollection<T>,
    { logChanges, logItems }: IChangeOptions = {}
  ) {
    return (source: Observable<DocumentChangeAction<T>[]>) =>
      source.pipe(
        tap(() => trace(collection.ref.path)),
        tap((changes: DocumentChangeAction<T>[]) => {
          traceIf(
            logChanges,
            collection.ref.path,
            changes.map((change) => change.type)
          );
        }),
        map((changes: DocumentChangeAction<T>[]) =>
          changes.map((change: DocumentChangeAction<T>) => ({
            id: change.payload.doc.id,
            ...(change.payload.doc.data() as T),
          }))
        ),
        tap((items: T[]) => traceIf(logItems, collection.ref.path, items))
      );
  }
}
