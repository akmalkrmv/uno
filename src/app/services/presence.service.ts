import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class PresenceService {
  constructor(private firedb: AngularFireDatabase) {}

  public startTracking(userId: string) {
    this.updateOnUser(userId).subscribe();
    this.updateOnDisconnect(userId);
    this.updateOnAway(userId);
  }

  public updateOnUser(uid: string) {
    return this.firedb
      .object('.info/connected')
      .valueChanges()
      .pipe(
        map((connected) => (connected ? 'online' : 'offline')),
        switchMap((connection) =>
          this.setPresence(uid, uid ? connection : 'offline')
        )
      );
  }

  public updateOnAway(uid: string) {
    document.onvisibilitychange = () => {
      document.visibilityState === 'hidden'
        ? this.setPresence(uid, 'away')
        : this.setPresence(uid, 'online');
    };
  }

  public updateOnDisconnect(uid: string) {
    return this.firedb
      .object(`status/${uid}`)
      .query.ref.onDisconnect()
      .update({ status: 'offline', timestamp: this.timestamp });
  }

  public getPresence(uid: string): Observable<any> {
    return this.firedb.object(`status/${uid}`).valueChanges();
  }

  public setPresence(uid: string, status: string) {
    return this.firedb
      .object(`status/${uid}`)
      .update({ status, timestamp: this.timestamp });
  }

  public get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
}
