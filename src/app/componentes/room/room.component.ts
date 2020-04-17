import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import {
  switchMap,
  take,
  map,
  distinctUntilChanged,
  throttleTime,
  takeWhile,
  combineLatest,
} from 'rxjs/operators';

import { User } from '../../models/user';
import { RoomService } from '../../services/room.service';
import { delimeter } from 'src/app/constants/logging';
import { UsersService } from 'src/app/services/users.service';
import { RoomUserService } from 'src/app/services/room-user.service';
import { MenuItemEvent } from 'src/app/models/menu-item-event';
import { vgaConstraints } from 'src/app/constants/rts-configurations';
import { OfferService } from 'src/app/services/offer.service';
import { Offer, Answer, IOffer } from 'src/app/models/room';

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
  public isConnectionOn = new BehaviorSubject(true);

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private roomService: RoomService,
    private usersService: UsersService,
    private roomUserService: RoomUserService,
    private offerService: OfferService
  ) {}

  ngOnDestroy() {
    this.hangup();
  }

  ngOnInit() {
    this.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.roomService.init(this.roomId);

    this.usersService
      .authorize()
      .pipe(untilDestroyed(this))
      .pipe(
        switchMap((user) =>
          this.roomUserService
            .joinRoom(this.roomId, user.id)
            .pipe(map(() => user))
        )
      )
      .subscribe((user) => {
        this.user = user;
        this.setStream(user);

        this.offerService.init(user);

        this.onlineUsers$ = this.roomUserService.roomUserIds(this.roomId).pipe(
          untilDestroyed(this),
          switchMap((userIds) => this.usersService.getByIds(userIds))
        );

        this.offers$ = this.roomService.userOffers(this.user.id).pipe(
          untilDestroyed(this),
          takeWhile(() => this.isConnectionOn.value)
        );

        this.answers$ = this.roomService.userAnswers(this.user.id).pipe(
          untilDestroyed(this),
          takeWhile(() => this.isConnectionOn.value)
        );

        const throttleTimeMs = 2000;
        this.listenToOffers(throttleTimeMs);
        this.listenToAnswers(throttleTimeMs);
        // this.retryCall();
      });
  }

  public setStream(user: User) {
    navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => {
      user.stream$.next(stream);
      this.muteVideo('#self-video');
    });
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
      .subscribe((users) => {
        for (const user of users) {
          this.offerService
            .createOfferToUser(this.user.id, user.id, user.name)
            .pipe(take(1))
            .subscribe();
        }
      });
  }

  public hangup() {
    // this.isConnectionOn.next(false);

    this.roomService
      .clearConnections()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.user.closeConnections();
        console.log(result, delimeter);

        this.isConnectionOn.next(true);
      });
  }

  public leaveRoom() {
    this.roomUserService
      .leaveRoom(this.roomId, this.user.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.router.navigate([`/`]));
  }

  public retryCall() {
    this.isConnectionOn.next(false);

    this.roomService
      .clearConnections()
      .pipe(
        take(1),
        untilDestroyed(this),
        switchMap(() => {
          this.user.closeConnections();
          return this.roomUsers();
        })
      )
      .subscribe((users) => {
        this.isConnectionOn.next(true);
        for (const user of users) {
          this.offerService
            .createOfferToUser(this.user.id, user.id, user.name)
            .pipe(take(1))
            .subscribe();
        }
      });
  }

  private roomUsers(): Observable<User[]> {
    return this.roomUserService
      .roomOtherUserIds(this.roomId, this.user.id)
      .pipe(switchMap((userIds) => this.usersService.getByIds(userIds)));
  }

  private compareOffers(before: IOffer[], after: IOffer[]) {
    if (before.length !== after.length) {
      console.log('Changed', before.length, after.length);
      return false;
    }

    for (const first of before) {
      const exists = after.find(
        (second) =>
          second.id == first.id && second.description == first.description
      );
      if (!exists) {
        console.log('Changed', first);
        return false;
      }
    }

    console.log('Not changed');
    return true;
  }

  private listenToOffers(throttleTimeMs: number) {
    this.offers$
      .pipe(
        throttleTime(throttleTimeMs),
        distinctUntilChanged(this.compareOffers),
        combineLatest(this.roomUsers())
      )
      .subscribe(([offers, users]) => {
        if (!offers || !offers.length) {
          // this.user.closeConnections();
          return;
        }

        console.log('got offer');

        offers.map((offer) => {
          const user = users.find((user) => user.id == offer.from);

          this.offerService
            .answerToOffer(offer, user.name)
            .pipe(take(1))
            .subscribe();
        });
      });
  }

  private listenToAnswers(throttleTimeMs: number) {
    this.answers$
      .pipe(
        throttleTime(throttleTimeMs),
        distinctUntilChanged(this.compareOffers),
        combineLatest(this.roomUsers())
      )
      .subscribe(([answers, users]) => {
        if (!answers || !answers.length) {
          // this.user.closeConnections();
          return;
        }

        console.log('got answer');

        for (const answer of answers) {
          const user = users.find((user) => user.id == answer.from);
          this.offerService
            .handleAnswer(answer, user && user.name)
            .pipe(take(1))
            .subscribe();
        }
      });
  }
}
