import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { of, from, Observable } from 'rxjs';

import * as firebaseApp from 'firebase/app';
import 'firebase/auth';

import { BaseFirestoreService } from './repository/base-firestore.service';
import { User } from '@models/index';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseFirestoreService {
  public user$: Observable<any>;

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

  public updateUserData(user: firebase.User) {
    const userRef = this.firestore.doc(`users/${user.uid}`);
    const payload = {
      id: user.uid,
      uid: user.uid,
      name: user.displayName,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      email: user.email,
    };

    return userRef.ref.get().then((user) => {
      return user.exists
        ? userRef.update(payload)
        : userRef.set({ ...payload, created: Date.now() }, { merge: true });
    });
  }
}
