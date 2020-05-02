import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, take } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';

import * as firebaseui from 'firebaseui';
import * as firebaseApp from 'firebase/app';
import 'firebase/auth';

import { User } from '@models/index';
import { BaseFirestoreService } from './repository/base-firestore.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseFirestoreService {
  public user$: Observable<User>;

  constructor(
    private router: Router,
    private fireauth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    super();

    this.user$ = this.fireauth.authState.pipe(
      switchMap((user) => {
        return user
          ? this.documentChanges(this.firestore.doc<User>(`users/${user.uid}`))
          : of(null);
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

        const email = 'user-' + Math.floor(Math.random() * 100000) + '@uno.com';

        firebaseApp
          .auth()
          .createUserWithEmailAndPassword(email, 'qweasd123')
          .then((credential) => {
            const name = prompt('Ваще имя: ');
            this.updateUserData(credential.user, name);
          });
      })
    );
  }

  public startUi(element: Element | string) {
    const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());
    ui.start(element, {
      signInOptions: [
        firebaseApp.auth.PhoneAuthProvider.PROVIDER_ID,
        firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseApp.auth.FacebookAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GithubAuthProvider.PROVIDER_ID,
      ],
      callbacks: {
        signInSuccessWithAuthResult: (credential) => {
          this.updateUserData(credential.user);
          return true;
        },
      },
      // Other config options...
    });
  }

  public googleSignIn() {
    const provider = new firebaseApp.auth.GoogleAuthProvider();
    return from(this.fireauth.signInWithPopup(provider)).pipe(
      switchMap((credential) => this.updateUserData(credential.user))
    );
  }

  public facebookSignIn() {
    const provider = new firebaseApp.auth.FacebookAuthProvider();
    return from(this.fireauth.signInWithPopup(provider)).pipe(
      switchMap((credential) => this.updateUserData(credential.user))
    );
  }

  public githubSignIn() {
    const provider = new firebaseApp.auth.GithubAuthProvider();
    return from(this.fireauth.signInWithPopup(provider)).pipe(
      switchMap((credential) => this.updateUserData(credential.user))
    );
  }

  public signOut() {
    return from(this.fireauth.signOut()).pipe(
      switchMap(() => this.router.navigate(['/']))
    );
  }

  public updateUserData(user: firebase.User | User, name?: string) {
    console.log('updateUserData', user);
    const userRef = this.firestore.doc(`users/${user.uid}`);
    const payload = {
      id: user.uid,
      uid: user.uid,
      name: name || user.displayName,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      email: user.email,
    };

    return userRef.ref
      .get()
      .then((user) => {
        return user.exists
          ? userRef.update(payload)
          : userRef.set({ ...payload, created: Date.now() }, { merge: true });
      })
      .then(() => this.router.navigate(['/']));
  }
}
