import {
  AngularFirestoreCollection,
  DocumentChangeAction,
} from 'angularfire2/firestore';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export class BaseFirestoreService {
  protected withId<T>(
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

  protected addToCollection<T>(
    collection: AngularFirestoreCollection<T>,
    item: T
  ): Observable<string> {
    return from(collection.add(item)).pipe(map((created) => created.id));
  }

}
