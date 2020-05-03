import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {
  switchMap,
  take,
  map,
  distinctUntilChanged,
  takeWhile,
  throttleTime,
} from 'rxjs/operators';

import { videoConstraints } from '@constants/index';
import { User, MenuItemEvent } from '@models/index';
import { Offer, Answer, IOffer } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { ConnectionService } from '@services/connection/connection.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public user: User;
  public roomId: string;
  public onlineUsers$: Observable<User[]>;
  public offers$: Observable<Offer[]>;
  public answers$: Observable<Answer[]>;
  public messages$: Observable<any[]>;
  public isConnectionOn = new BehaviorSubject(true);
  public title$: Observable<string>;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private connectionService: ConnectionService
  ) {}

  ngOnDestroy() {
    this.hangup();
    this.closeStream(this.user);
  }

  ngOnInit() {
    this.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.api.room.init(this.roomId);

    const roomExists$ = this.api.room.exists(this.roomId).pipe(
      take(1),
      untilDestroyed(this),
      map((exists) => {
        if (!exists) this.router.navigate(['']);
        return exists;
      })
    );

    const authorize$ = this.auth
      .authorize()
      .pipe(take(1), untilDestroyed(this));

    roomExists$
      .pipe(
        switchMap((exists) => (exists ? authorize$ : of(null))),
        switchMap((user) => (user ? this.joinRoom(user) : of(null)))
      )
      .pipe(take(1), untilDestroyed(this))
      .subscribe((user) => {
        if (!user) return;
        this.initialize(user);
      });
  }

  public initialize(user: User) {
    this.user = user;
    this.setStream(user);

    this.connectionService.init(user);

    this.onlineUsers$ = this.api.roomUsers.roomUserIds(this.roomId).pipe(
      untilDestroyed(this),
      switchMap((userIds) => this.api.users.getByIds(userIds))
    );

    this.title$ = this.onlineUsers$.pipe(
      untilDestroyed(this),
      map((users) => users.map((user) => user.name).join(', '))
    );

    this.offers$ = this.api.room.userOffers(this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn.value)
    );

    this.answers$ = this.api.room.userAnswers(this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn.value)
    );

    this.listenToOffers();
    this.listenToAnswers();
    // this.confirmJoinCall();
  }

  public confirmJoinCall() {
    this.onlineUsers$.pipe(take(1), untilDestroyed(this)).subscribe((users) => {
      if (users && users.length > 1) {
        if (confirm('Готовы подключиться к звонку?')) {
          this.call();
        }
      }
    });
  }

  public setStream(user: User) {
    const muteSelfMedia = () => this.muteVideo('#self-video');

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => (user.stream = stream))
      .then(() => muteSelfMedia())
      .then(() =>
        navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
        })
      )
      .then((stream) =>
        stream.getTracks().forEach((track) => user.stream.addTrack(track))
      )
      .catch((error) => console.log(error))
      .finally(() => muteSelfMedia());
  }

  public closeStream(user: User) {
    if (!user) return;
    if (!user.stream) return;

    user.stream.getTracks().forEach((track) => {
      track.stop();
      user.stream.removeTrack(track);
    });

    user.stream = null;
  }

  public requestMedia() {
    this.setStream(this.user);
  }

  public muteVideo(selector: string) {
    setTimeout(() => {
      const currentVideo = document.querySelector(selector);
      currentVideo && ((currentVideo as HTMLVideoElement).volume = 0);
    }, 100);
  }

  public onMenuItemClicked($event: MenuItemEvent) {
    this[$event.type] &&
      typeof this[$event.type] == 'function' &&
      this[$event.type]();
  }

  public call() {
    this.isConnectionOn.next(true);

    this.roomUsers()
      .pipe(take(1), untilDestroyed(this))
      .subscribe((users) =>
        this.connectionService.offerAll(this.user.id, users)
      );
  }

  public hangup() {
    if (!this.user) return;

    // this.isConnectionOn.next(false);
    this.user.closeConnections();

    this.api.room
      .clearConnections()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.user.closeConnections();
      });
  }

  public leaveRoom() {
    this.api.roomUsers
      .leaveRoom(this.roomId, this.user.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.router.navigate([`/`]));
  }

  public retryCall() {
    this.isConnectionOn.next(false);
    this.user.closeConnections();

    this.api.room
      .clearConnections()
      .pipe(
        take(1),
        untilDestroyed(this),
        switchMap(() => this.roomUsers())
      )
      .subscribe((users) => {
        this.isConnectionOn.next(true);
        this.connectionService.offerAll(this.user.id, users);
      });
  }

  private roomUsers(): Observable<User[]> {
    return this.api.roomUsers
      .roomOtherUserIds(this.roomId, this.user.id)
      .pipe(switchMap((userIds) => this.api.users.getByIds(userIds)));
  }

  private joinRoom(user: User) {
    return this.api.roomUsers.joinRoom(this.roomId, user.id).pipe(
      take(1),
      untilDestroyed(this),
      map(() => user)
    );
  }

  private compareOffers(before: IOffer[], after: IOffer[]) {
    if (before.length !== after.length) {
      console.log('Offers changed', before.length, after.length);
      return false;
    }

    for (const first of before) {
      const exists = after.find(
        (second) =>
          second.id == first.id && second.description == first.description
      );
      if (!exists) {
        console.log('Offers changed', first);
        return false;
      }
    }

    return true;
  }

  private listenToOffers() {
    this.offers$
      .pipe(throttleTime(300), distinctUntilChanged(this.compareOffers))
      .subscribe((offers) => {
        if (!offers || !offers.length) {
          this.user.closeConnections();
          return;
        }

        this.roomUsers()
          .pipe(take(1), untilDestroyed(this))
          .subscribe((users) =>
            this.connectionService.answerAll(offers, users)
          );
      });
  }

  private listenToAnswers() {
    this.answers$
      .pipe(throttleTime(300), distinctUntilChanged(this.compareOffers))
      .subscribe((answers) => {
        if (!answers || !answers.length) {
          this.user.closeConnections();
          return;
        }

        this.roomUsers()
          .pipe(take(1), untilDestroyed(this))
          .subscribe((users) =>
            this.connectionService.setRemoteAll(answers, users)
          );
      });
  }
}
