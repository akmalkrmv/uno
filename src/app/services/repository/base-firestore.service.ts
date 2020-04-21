import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentChangeAction,
  DocumentSnapshot,
  Action,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class BaseFirestoreService {
  protected collectionChanges<T>(
    collection: AngularFirestoreCollection<T>,
    logItems = true,
    logChanges = false
  ): Observable<T[]> {
    return collection
      .snapshotChanges()
      .pipe(
        tap((changes: DocumentChangeAction<T>[]) => {
          logChanges && console.log(`${collection.ref.path}`, changes);
        })
      )
      .pipe(
        map((changes: DocumentChangeAction<T>[]) =>
          changes.map((change: DocumentChangeAction<T>) => ({
            ...(change.payload.doc.data() as T),
            id: change.payload.doc.id,
          }))
        )
      )
      .pipe(
        tap((items: T[]) => {
          logItems && console.log(`${collection.ref.path}`, items);
        })
      );
  }

  protected documentChanges<T>(
    document: AngularFirestoreDocument<T>,
    logItems = true,
    logChanges = false
  ): Observable<T> {
    return document
      .snapshotChanges()
      .pipe(
        tap((change: Action<DocumentSnapshot<T>>) => {
          logChanges && console.log(`${document.ref.path}`, change);
        })
      )
      .pipe(
        map((change: Action<DocumentSnapshot<T>>) => ({
          ...(change.payload.data() as T),
          id: change.payload.id,
        }))
      )
      .pipe(
        tap((item: T) => {
          logItems && console.log(`${document.ref.path}`, item);
        })
      );
  }

  protected addToCollection<T>(
    collection: AngularFirestoreCollection<T>,
    payload: T
  ): Observable<string> {
    payload = { created: Date.now(), ...payload };
    return from(collection.add(payload)).pipe(map((created) => created.id));
  }
}
