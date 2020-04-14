import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  switchMap,
  take,
  map,
  distinctUntilChanged,
  throttleTime,
} from 'rxjs/operators';

import { User } from '../../models/user';
import { RoomService } from '../../services/room.service';
import { delimeter } from 'src/app/constants/logging';
import { UsersService } from 'src/app/services/users.service';
import { RoomUserService } from 'src/app/services/room-user.service';
import { MenuItemEvent } from 'src/app/models/menu-item-event';
import { vgaConstraints } from 'src/app/constants/rts-configurations';
import { OfferService } from 'src/app/services/offer.service';
import { Offer } from 'src/app/models/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public user: User;
  public roomId: string;
  public onlineUsers$: Observable<User[]>;
  public isAudioOn = new BehaviorSubject(true);
  public isVideoOn = new BehaviorSubject(true);
  public isFront = new BehaviorSubject(true);
  public canFlipCamera = false;

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

        this.onlineUsers$ = this.roomUserService
          .roomUserIds(this.roomId)
          .pipe(switchMap((userIds) => this.usersService.getByIds(userIds)));

        this.roomService
          .userOffers(this.user.id)
          .pipe(
            untilDestroyed(this),
            throttleTime(1000),
            distinctUntilChanged(this.compareOffers)
          )
          .subscribe((offers) => {
            for (const offer of offers) {
              this.offerService
                .answerToOffer(offer)
                .pipe(take(1))
                .subscribe(() => {
                  // Call back when someone calls
                  this.offerService
                    .createOfferToUser(this.user.id, offer.from)
                    .pipe(take(1))
                    .subscribe();
                });
            }
          });

        this.roomService
          .userAnswers(this.user.id)
          .pipe(untilDestroyed(this))
          .subscribe((answers) => {
            for (const answer of answers) {
              this.offerService.handleAnswer(answer).pipe(take(1)).subscribe();
            }
          });

        // this.retryCall();
      });
  }

  public setStream(user: User) {
    navigator.mediaDevices.getUserMedia(vgaConstraints).then((stream) => {
      user.stream = stream;
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
    this.roomUserService
      .roomOtherUserIds(this.roomId, this.user.id)
      .pipe(untilDestroyed(this), take(1))
      .subscribe((userIds) => {
        for (const userId of userIds) {
          this.offerService
            .createOfferToUser(this.user.id, userId)
            .pipe(take(1))
            .subscribe();
        }
      });
  }

  public hangup() {
    console.log('Hanging up, Deleting offers');

    this.roomService
      .clearConnections()
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        this.user.closeConnections();
        console.log(result, delimeter);
      });
  }

  public leaveRoom() {
    this.roomUserService
      .leaveRoom(this.roomId, this.user.id)
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.router.navigate([`/`]));
  }

  public retryCall() {
    console.log('recalling, hangup started');

    this.roomService
      .clearConnections()
      .pipe(
        switchMap(() => {
          this.user.closeConnections();
          console.log('hangup done, call started');

          return this.roomUserService.roomOtherUserIds(
            this.roomId,
            this.user.id
          );
        })
      )
      .subscribe((userIds) => {
        console.log('creating offers');
        for (const userId of userIds) {
          this.offerService
            .createOfferToUser(this.user.id, userId)
            .pipe(take(1))
            .subscribe();
        }
        console.log('call done', delimeter);
      });
  }

  private compareOffers(before: Offer[], after: Offer[]) {
    console.log({ before, after });

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
}
