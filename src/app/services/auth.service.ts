import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, take } from 'rxjs/operators';
import { of, from, Observable, combineLatest, BehaviorSubject } from 'rxjs';

import * as firebaseui from 'firebaseui';
import * as firebaseApp from 'firebase/app';
import 'firebase/auth';

import { User } from '@models/index';
import { ApiService } from './repository/api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public user$: Observable<User>;

  constructor(
    private router: Router,
    private fireauth: AngularFireAuth,
    private api: ApiService
  ) {
    this.user$ = combineLatest([fireauth.authState, api.users.users$]).pipe(
      switchMap(([user]) => {
        return user ? this.api.users.findById(user.uid) : of(null);
      })
    );
  }

  public isSignedIn() {
    return this.user$.pipe(map((user) => user != null));
  }

  public hasRole(role: string) {
    return this.user$.pipe(map((user) => user && user.role === role));
  }

  public authorize(): Observable<User> {
    return this.user$.pipe(
      take(1),
      switchMap((user) => {
        if (user) return of(new User(user.id, user.name));
      })
    );
  }

  public startUi(element: Element | string) {
    const auth = firebaseApp.auth();
    // auth.useDeviceLanguage();
    auth.languageCode = 'ru';

    const ui = new firebaseui.auth.AuthUI(auth);
    const withoutCaptcha = (provider: string) => ({
      provider,
      recaptchaParameters: { size: 'invisible' },
    });

    ui.start(element, {
      signInOptions: [
        withoutCaptcha(firebaseApp.auth.PhoneAuthProvider.PROVIDER_ID),
        withoutCaptcha(firebaseApp.auth.EmailAuthProvider.PROVIDER_ID),
        firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseApp.auth.FacebookAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GithubAuthProvider.PROVIDER_ID,
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
}
