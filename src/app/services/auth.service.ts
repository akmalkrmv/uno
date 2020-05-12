import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, map, filter, first } from 'rxjs/operators';
import { of, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { IUser, IUserInfo, toUserInfo } from '@models/index';
import { LocalStorageKeys } from '@constants/index';
import { ApiService } from './repository/api.service';
import { PresenceService } from './presence.service';
import { NavigationService } from './navigation.service';

import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase/app';
import 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private current$ = new BehaviorSubject<IUser>(null);
  private refreshEvent$ = new BehaviorSubject<number>(null);

  constructor(
    private router: Router,
    private api: ApiService,
    private fireauth: AngularFireAuth,
    private presence: PresenceService,
    private navigate: NavigationService
  ) {
    combineLatest([fireauth.authState, this.refreshEvent$])
      .pipe(
        switchMap(([firebaseUser]) =>
          firebaseUser ? this.api.users.findById(firebaseUser.uid) : of(null)
        )
      )
      .subscribe((user: IUser) => {
        if (user && !user.name) {
          localStorage.setItem(LocalStorageKeys.redirectUrl, location.pathname);
          this.router.navigate(['/name']);
        }

        this.current$.next(user);
        this.presence.startTracking(user?.id);
      });
  }

  public get current(): IUser {
    return this.current$.value;
  }

  public get currentId(): string {
    return this.current$.value?.id;
  }

  public get authorized$(): Observable<IUser> {
    return this.current$.pipe(
      filter((user) => !!user),
      first()
    );
  }

  public get authorizedInfo$(): Observable<IUserInfo> {
    return this.authorized$.pipe(map(toUserInfo));
  }

  public isSignedIn() {
    return this.fireauth.authState.pipe(
      map((firebaseUser) => firebaseUser != null)
    );
  }

  public hasRole(role: string): Observable<boolean> {
    return this.authorized$.pipe(map((user) => user.role === role));
  }

  public startUi(element: Element | string): void {
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
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (credential, redirectUrl: string) => {
          this.saveCredentials(credential.user).then(() => {
            if (redirectUrl) {
              this.router.navigate([redirectUrl]);
            } else {
              this.navigate.redirectIfShould();
            }
          });

          return false;
        },
      },
    });
  }

  public signOut(): void {
    this.presence.setPresence(this.currentId, 'offline');
    this.fireauth.signOut().then(() => location.reload());
  }

  public refresh(): void {
    this.refreshEvent$.next(Date.now());
  }

  private async saveCredentials(user: firebase.User): Promise<void> {
    const payload: IUser = {
      id: user.uid,
      name: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      email: user.email,
    };

    await this.api.users.addIfNotExists(payload);
  }
}
