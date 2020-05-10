import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {
  switchMap,
  first,
  map,
  distinctUntilChanged,
  takeWhile,
  throttleTime,
  tap,
  filter,
} from 'rxjs/operators';

import { copyToClipboard, shareLink } from '@utils/index';
import { User, Offer, Answer, IOffer, Room, IUser } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { TitleService } from '@services/title.service';
import { ConnectionService } from '@services/connection/connection.service';
import { RoomCommandsService } from './room-commands.service';
import { MediaService } from './media.service';
import { CommandsService } from '@services/commands.service';
import { MessagingService } from '@services/messaging.service';

@Injectable({ providedIn: 'root' })
export class RoomService implements OnDestroy {
  public onlineUsers$: Observable<IUser[]>;
  public offers$: Observable<Offer[]>;
  public answers$: Observable<Answer[]>;
  public title$: Observable<string>;
  public code$: Observable<string>;

  public isConnectionOn = new BehaviorSubject(true);
  public user$ = new BehaviorSubject<User>(null);

  public roomId: string;
  public user: User;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private connectionService: ConnectionService,
    private title: TitleService,
    private roomCommands: RoomCommandsService,
    private commands: CommandsService,
    private media: MediaService,
    private snackBar: MatSnackBar,
    private messaging: MessagingService
  ) {}

  ngOnDestroy() {
    this.hangup();
    this.closeStream(this.user);
    this.title.toDefault();
    this.roomCommands.unregister();
  }

  ngOnInit() {
    this.api.room.init(this.roomId);

    const roomExists$ = this.api.room
      .exists(this.roomId)
      .pipe(first(), untilDestroyed(this))
      .pipe(tap((exists) => !exists && this.router.navigate([''])));

    const authorize$ = this.auth.user$.pipe(
      first(),
      untilDestroyed(this),
      map((user) => (user ? new User(user.id, user.name) : null))
    );

    roomExists$
      .pipe(switchMap((exists) => (exists ? authorize$ : of(null))))
      .pipe(switchMap((user) => (user ? this.joinRoom(user) : of(null))))
      .pipe(first(), untilDestroyed(this))
      .subscribe((user) => {
        if (!user) return;
        this.initialize(user);
      });

    this.roomCommands.register();
    this.commands.current$
      .pipe(untilDestroyed(this))
      .pipe(filter((current) => !!current))
      .subscribe((current) => {
        const command: Function = this[current.name];
        if (command && typeof command == 'function') {
          command.call(this);
        }
      });
  }

  public initialize(user: User) {
    this.user = user;
    this.user$.next(user);
    this.setStream(user);

    this.connectionService.init(user);

    this.onlineUsers$ = this.api.roomUsers.roomUserIds(this.roomId).pipe(
      untilDestroyed(this),
      switchMap((userIds) => this.api.users.getByIds(userIds))
    );

    this.offers$ = this.api.room.userOffers(this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn.value)
    );

    this.answers$ = this.api.room.userAnswers(this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn.value)
    );

    this.setTitle();
    this.listenToOffers();
    this.listenToAnswers();
    this.confirmJoinCall();

    this.code$ = this.user.messages$.pipe(tap((data) => console.log(data)));

    // this.messaging.requestPermission(this.user.id);
    // this.messaging.receiveMessage();
  }

  public confirmJoinCall() {
    this.onlineUsers$.pipe(first(), untilDestroyed(this)).subscribe((users) => {
      if (users && users.length > 1) {
        // this.call();
        // if (confirm('Готовы подключиться к звонку?')) {
        // }
      }
    });
  }

  public async setStream(user: User) {
    await this.media.setStream(user);
  }

  public closeStream(user: User) {
    this.media.closeStream(user);
  }

  public requestMedia(user: User) {
    this.media.requestMedia(user);
  }

  public transferText(text: string) {
    this.user.connections.forEach((connection) => {
      connection.transfer.send(text);
    });
  }

  public shareLink() {
    shareLink('Присоединяйтесь к видео звонку:', location.href);
  }

  public copyLink() {
    copyToClipboard(location.href);
    this.snackBar.open(`Cсылка скопирована`, '', { duration: 2000 });
  }

  public call() {
    this.isConnectionOn.next(true);

    this.roomUsers()
      .pipe(first(), untilDestroyed(this))
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
      .subscribe(() => this.user.closeConnections());
  }

  public leaveRoom() {
    this.api.roomUsers
      .leaveRoom(this.roomId, this.user.id)
      .pipe(first(), untilDestroyed(this))
      .subscribe(() => this.router.navigate([`/`]));
  }

  public retryCall() {
    this.isConnectionOn.next(false);
    this.user.closeConnections();

    this.api.room
      .clearConnections()
      .pipe(first(), untilDestroyed(this))
      .pipe(switchMap(() => this.roomUsers()))
      .subscribe((users) => {
        this.isConnectionOn.next(true);
        this.connectionService.offerAll(this.user.id, users);
      });
  }

  private roomUsers(): Observable<IUser[]> {
    return this.api.roomUsers
      .roomOtherUserIds(this.roomId, this.user.id)
      .pipe(switchMap((userIds) => this.api.users.getByIds(userIds)));
  }

  private joinRoom(user: User) {
    return this.api.roomUsers
      .joinRoom(this.roomId, user.id)
      .pipe(first(), untilDestroyed(this))
      .pipe(map(() => user));
  }

  private async setTitle() {
    const roomRef = await this.api.room.room.ref.get();
    const room: Room = roomRef.data();

    this.title.icon$.next('group');

    if (room.name) {
      this.title.text$.next(room.name);
    } else {
      this.onlineUsers$.pipe(untilDestroyed(this)).subscribe((users) => {
        const names = users.map((user) => user.name).join(', ');
        this.title.text$.next(names);
      });
    }
  }

  private compareOffers(before: IOffer[], after: IOffer[]) {
    if (before.length !== after.length) {
      console.log('Offers changed');
      return false;
    }

    for (const first of before) {
      const exists = after.find(
        (second) =>
          second.id == first.id && second.description == first.description
      );
      if (!exists) {
        console.log('Offers changed');
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
          .pipe(first(), untilDestroyed(this))
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
          .pipe(first(), untilDestroyed(this))
          .subscribe((users) =>
            this.connectionService.setRemoteAll(answers, users)
          );
      });
  }
}
