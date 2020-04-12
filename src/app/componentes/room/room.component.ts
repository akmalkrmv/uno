import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';

import { vgaConstraints } from 'src/app/constants/rts-configurations';
import { User } from '../../models/user';
import { RoomService } from '../../services/room.service';
import { Offer, Answer } from 'src/app/models/room';
import { delimeter } from 'src/app/constants/logging';
import { UsersService } from 'src/app/services/users.service';
import { RoomUserService } from 'src/app/services/room-user.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId: string;
  public user: User;
  public onlineUsers$: Observable<User[]>;

  constructor(
    private activeRoute: ActivatedRoute,
    private roomService: RoomService,
    private usersService: UsersService,
    private roomUserService: RoomUserService
  ) {}

  async ngOnDestroy() {
    await this.hangup();
  }

  async ngOnInit() {
    this.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.roomService.init(this.roomId);
    // this.logging();

    this.user = await this.usersService.authorize();
    await this.startSelfStream();
    await this.roomUserService.joinRoom(this.roomId, this.user.id);

    this.onlineUsers$ = this.roomUserService
      .roomUserIds(this.roomId)
      .pipe(switchMap((userIds) => this.usersService.getByIds(userIds)));

    this.roomService
      .userOffers(this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe(async (offers) => {
        for (const offer of offers) {
          await this.answerToOffer(offer);
          // Call back when someone calls
          await this.createOfferToUser(this.user.id, offer.from);
        }
      });

    this.roomService
      .userAnswers(this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe(async (answers) => {
        for (const answer of answers) {
          await this.handleAnswer(answer);
        }
      });
  }

  public async startSelfStream() {
    const stream = await navigator.mediaDevices.getUserMedia(vgaConstraints);
    this.user.stream = stream;
    this.muteAllVideos();
  }

  public async call() {
    this.roomUserService
      .roomOtherUserIds(this.roomId, this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe(async (userIds) => {
        for (const userId of userIds) {
          await this.createOfferToUser(this.user.id, userId);
        }
      });
  }

  public async hangup() {
    console.log('Deleting offers');

    this.roomService.clearConnections().subscribe((result) => {
      for (const connection of this.user.connections) {
        connection.remote.close();
      }

      this.user.connections = [];
      console.log(result, delimeter);
    });
  }

  public async createOfferToUser(from: string, to: string) {
    try {
      const connection = this.user.getConnection(to).remote;
      this.user.addTracks(connection);

      console.log('Creating offer to ', to);
      console.log('Setting remote description', delimeter);

      const offer = await connection.createOffer();
      connection.setLocalDescription(offer);

      await this.roomService.createOffer({
        from,
        to,
        description: connection.localDescription.toJSON(),
      });

      console.log('Done creating offer', delimeter);
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public async answerToOffer(offer: Offer) {
    try {
      console.log('Got offer from', offer.from);
      console.log('Setting remote description');

      const connection = this.user.getConnection(offer.from).remote;
      await connection.setRemoteDescription(offer.description);

      console.log('Creating answer');
      console.log('Setting local description', delimeter);

      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      await this.roomService.createAnswer({
        to: offer.from,
        from: this.user.id,
        description: connection.localDescription.toJSON(),
      });

      console.log('Done creating answer', delimeter);
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public async handleAnswer(answer: Answer) {
    try {
      console.log('Got answer from', answer.from);
      console.log('Setting remote description', delimeter);

      const connection = this.user.getConnection(answer.from).remote;
      await connection.setRemoteDescription(answer.description);

      this.muteAllVideos();
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public muteAllVideos() {
    setTimeout(() => {
      console.log('Muting all sounds', delimeter);

      const videos = Array.from(document.getElementsByTagName('video'));
      videos.forEach((video) => (video.muted = true));
    }, 100);
  }

  private logging() {
    this.roomService.users$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log('users', items);
    });

    this.roomService.offers$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log('offers', items);
    });

    this.roomService.answers$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log('answers', items);
    });

    this.roomService
      .userJoined(this.roomId)
      .pipe(untilDestroyed(this))
      .subscribe((users) => {
        console.log('joind: ', users);
      });
  }
}
