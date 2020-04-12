import {
  AngularFirestoreCollection,
  DocumentChangeAction,
} from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class BaseFirestoreService {
  protected withId<T>(
    collection: AngularFirestoreCollection<T>
  ): Observable<T[]> {
    return collection.snapshotChanges().pipe(
      map((changes: DocumentChangeAction<T>[]) =>
        changes.map((change: DocumentChangeAction<T>) => ({
          ...(change.payload.doc.data() as T),
          id: change.payload.doc.id,
        }))
      )
    );
  }
}
