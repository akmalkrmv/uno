import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { switchMap, map, take, first, tap } from 'rxjs/operators';
import { of, from, Observable, combineLatest, BehaviorSubject } from 'rxjs';

import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import { User } from '@models/index';
import { ApiService } from './repository/api.service';

type presenceStatus = 'online' | 'away' | 'offline';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user$: Observable<User>;
  public current$ = new BehaviorSubject<User>(null);
  public currentId$ = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private fireauth: AngularFireAuth,
    private firedb: AngularFireDatabase,
    private api: ApiService
  ) {
    this.user$ = combineLatest([fireauth.authState, api.users.users$]).pipe(
      switchMap(([user]) =>
        user ? this.api.users.findById(user.uid) : of(null)
      ),
      tap((user) => this.current$.next(user)),
      tap((user) => this.currentId$.next(user?.id))
    );

    this.updateOnUser().subscribe();
    this.updateOnDisconnect().subscribe();
    this.updateOnAway();
  }

  public isSignedIn() {
    return this.user$.pipe(map((user) => user != null));
  }

  public hasRole(role: string) {
    return this.user$.pipe(map((user) => user && user.role === role));
  }

  public startUi(element: Element | string) {
    const auth = firebase.auth();
    // auth.useDeviceLanguage();
    auth.languageCode = 'ru';

    const ui = new firebaseui.auth.AuthUI(auth);
    const withoutCaptcha = (provider: string) => ({
      provider,
      recaptchaParameters: { size: 'invisible' },
    });

    ui.start(element, {
      signInOptions: [
        withoutCaptcha(firebase.auth.PhoneAuthProvider.PROVIDER_ID),
        withoutCaptcha(firebase.auth.EmailAuthProvider.PROVIDER_ID),
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (credential) => {
          this.updateUserData(credential.user);
          return false;
        },
      },
    });
  }

  public signOut() {
    this.setPresence('offline');
    return from(this.fireauth.signOut()).pipe(
      switchMap(() => this.router.navigate(['/']))
    );
  }

  public updateUserData(user: firebase.User | User, name?: string) {
    const payload = {
      id: user.uid,
      uid: user.uid,
      name: name || user.displayName,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      email: user.email,
    };

    return this.api.users
      .addIfNotExists(payload)
      .then(() => this.router.navigate(['/']));
  }

  public updateOnUser(): Observable<presenceStatus> {
    const connection = this.firedb
      .object('.info/connected')
      .valueChanges()
      .pipe(map((connected) => (connected ? 'online' : 'offline')));

    return this.user$.pipe(
      switchMap((user) =>
        user ? connection : of('offline' as presenceStatus)
      ),
      tap((status) => this.setPresence(status))
    );
  }

  public updateOnAway() {
    document.onvisibilitychange = () => {
      document.visibilityState === 'hidden'
        ? this.setPresence('away')
        : this.setPresence('online');
    };
  }

  public updateOnDisconnect() {
    return this.user$.pipe(
      tap((user) => {
        if (user)
          this.firedb
            .object(`status/${user.id}`)
            .query.ref.onDisconnect()
            .update({ status: 'offline', timestamp: this.timestamp });
      })
    );
  }

  public getPresence(uid: string): Observable<any> {
    return this.firedb.object(`status/${uid}`).valueChanges();
  }

  public async setPresence(status: presenceStatus) {
    const user = await this.user$.pipe(first()).toPromise();
    if (user) {
      return this.firedb
        .object(`status/${user.id}`)
        .update({ status, timestamp: this.timestamp });
    }
  }

  public get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
}
