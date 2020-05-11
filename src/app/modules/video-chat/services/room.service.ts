import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  first,
  map,
  distinctUntilChanged,
  takeWhile,
  throttleTime,
  tap,
  filter,
} from 'rxjs/operators';

import { copyToClipboard, shareLink } from '@utils/index';
import { User, Answer, IUser, IOffer } from '@models/index';
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
  public offers$: Observable<IOffer[]>;
  public answers$: Observable<Answer[]>;
  public title$: Observable<string>;
  public code$: Observable<string>;

  public isConnectionOn$ = new BehaviorSubject(true);
  public user$ = new BehaviorSubject<User>(null);
  public viewState$ = new BehaviorSubject<string>('top');

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
    private snackBar: MatSnackBar
  ) {}

  ngOnDestroy() {
    this.hangup();
    this.closeStream();
    this.title.toDefault();
    this.roomCommands.unregister();
  }

  async ngOnInit() {
    const roomExists = await this.api.room.exists(this.roomId);
    if (!roomExists) {
      return this.router.navigate(['']);
    }

    const authorize$ = this.auth.authorized$.pipe(
      untilDestroyed(this),
      tap((user) => user && this.joinRoom(user)),
      map((user) => (user ? new User(user.id, user.name) : null))
    );

    authorize$.pipe(first(), untilDestroyed(this)).subscribe((user) => {
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
    // this.setStream(user);

    this.connectionService.init(user, this.roomId);

    this.onlineUsers$ = this.api.room
      .roomUsers(this.roomId)
      .pipe(untilDestroyed(this));

    this.offers$ = this.api.offer.userOffers(this.roomId, this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn$.value)
    );

    this.answers$ = this.api.offer.userAnswers(this.roomId, this.user.id).pipe(
      untilDestroyed(this),
      takeWhile(() => this.isConnectionOn$.value)
    );

    this.api.offer
      .userDisconnections(this.roomId, this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe((offers) => {
        console.log('dissconnection', offers);
        offers.forEach((offer) => this.user.closeConnection(offer.sender));
      });

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

  public async setStream() {
    this.viewState$.next('middle');
    await this.media.setStream(this.user);
  }

  public closeStream() {
    this.media.closeStream(this.user);
  }

  public requestMedia() {
    this.media.requestMedia(this.user);
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

  public async call() {
    this.isConnectionOn$.next(true);

    await this.setStream();

    this.roomUsers()
      .pipe(first(), untilDestroyed(this))
      .subscribe((users) =>
        this.connectionService.offerAll(this.user.id, users)
      );
  }

  public async hangup() {
    if (!this.user) return;

    console.log('clearing connections..');
    this.isConnectionOn$.next(false);

    this.user.closeConnections();
    this.viewState$.next('top');
    this.closeStream();
    await this.api.offer.clearConnections(this.roomId, this.user.id);

    this.isConnectionOn$.next(true);
    console.log('clearing connections done.');
  }

  public async leaveRoom() {
    await this.api.room.leaveRoom(this.roomId, this.user.id);
    this.router.navigate([`/`]);
  }

  public async retryCall() {
    this.isConnectionOn$.next(false);
    this.user.closeConnections();

    await this.api.offer.clearConnections(this.roomId, this.user.id);

    this.roomUsers()
      .pipe(first(), untilDestroyed(this))
      .subscribe((users) => {
        this.isConnectionOn$.next(true);
        this.connectionService.offerAll(this.user.id, users);
      });
  }

  private roomUsers(): Observable<IUser[]> {
    return this.api.room.roomOtherUsers(this.roomId, this.user.id);
  }

  private async joinRoom(user: IUser) {
    await this.api.room.joinRoom(this.roomId, user);
    return user;
  }

  private async setTitle() {
    this.title.icon$.next('group');

    this.api.room
      .onRoomChange(this.roomId)
      .pipe(untilDestroyed(this))
      .subscribe((room) => {
        if (room.name) {
          this.title.text$.next(room.name);
        } else {
          const names = room.users.map((user) => user.name).join(', ');
          this.title.text$.next(names);
        }
      });
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
      .subscribe(async (offers) => {
        if (!offers || !offers.length) {
          // this.user.closeConnections();
          return;
        }

        await this.setStream();

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
          // this.user.closeConnections();
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
