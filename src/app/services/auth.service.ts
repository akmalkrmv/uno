import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, tap } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { IUser } from '@models/index';
import { ApiService } from './repository/api.service';

import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { PresenceService } from './presence.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user$: Observable<IUser>;
  public current$ = new BehaviorSubject<IUser>(null);
  public currentId$ = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private api: ApiService,
    private fireauth: AngularFireAuth,
    private presence: PresenceService
  ) {
    this.user$ = fireauth.authState.pipe(
      switchMap((user: firebase.User) =>
        user ? this.api.users.findById(user.uid) : of(null)
      ),
      tap((user) => this.current$.next(user)),
      tap((user) => this.currentId$.next(user?.id)),
      tap((user) => this.presence.startTracking(user?.id))
    );
  }

  public isSignedIn() {
    return this.user$.pipe(map((user) => user != null));
  }

  public hasRole(role: string) {
    return this.user$.pipe(map((user) => user && user.role === role));
  }

  public startUi(element: Element | string) {
    const auth = firebase.auth();
    auth.useDeviceLanguage();

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
    this.presence.setPresence(this.currentId$.value, 'offline');
    this.fireauth.signOut().then(() => location.reload());
  }

  public async updateUserData(user: firebase.User) {
    const payload = {
      id: user.uid,
      name: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      email: user.email,
    };

    await this.api.users.addIfNotExists(payload);
    return await this.router.navigate(['']);
  }
}
