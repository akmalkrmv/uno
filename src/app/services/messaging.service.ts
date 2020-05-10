import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './repository/api.service';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  public message$ = new BehaviorSubject(null);

  constructor(
    // private auth: AngularFireAuth,
    // private database: AngularFireDatabase,
    private api: ApiService,
    private messaging: AngularFireMessaging
  ) {}

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  public updateToken(userId: string, token: string) {
    // we can change this function to request our backend service
    this.api.users.saveToken(userId, token);
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  public requestPermission(userId: string) {
    this.messaging.requestToken.subscribe(
      (token) => {
        console.log('token: ', token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  public monitorRefresh(userId: string) {
    this.messaging.onTokenRefresh(() => {
      this.messaging.getToken.subscribe(
        (refreshToken) => {
          console.log('refreshToken: ', refreshToken);
          this.updateToken(userId, refreshToken);
        },
        (err) => {
          console.error('Cannot get token.', err);
        }
      );
    });
  }

  /**
   * hook method when new notification received in foreground
   */
  public receiveMessage() {
    this.messaging.messages.subscribe((payload) => {
      console.log('new message received. ', payload);
      this.message$.next(payload);
    });
  }
}
