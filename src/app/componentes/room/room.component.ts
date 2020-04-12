import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from '../../models/user';
import { RoomService } from '../../services/room.service';
import { Offer, Answer } from 'src/app/models/room';
import { delimeter } from 'src/app/constants/logging';
import { UsersService } from 'src/app/services/users.service';
import { RoomUserService } from 'src/app/services/room-user.service';
import { ClipboardService } from 'src/app/services/clipboard.service';

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
    private snackBar: MatSnackBar,
    private router: Router,
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

    this.user = await this.usersService.authorize();
    await this.updateStream();
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

    merge([this.isAudioOn, this.isVideoOn, this.isFront])
      .pipe(untilDestroyed(this))
      .subscribe(async () => {
        // await this.updateStream();
      });

    const devices = await navigator.mediaDevices.enumerateDevices();
    this.canFlipCamera =
      devices.filter((device) => device.kind == 'videoinput').length > 1;

    this.call();
  }

  public toggleSound() {
    this.isAudioOn.next(!this.isAudioOn.value);
    this.user.toggleAudio();
  }
  public toggleVideo() {
    this.isVideoOn.next(!this.isVideoOn.value);
    this.user.toggleVideo();
  }
  public async flipCamera() {
    this.isFront.next(!this.isFront.value);
  }

  public async updateStream() {
    const stream = await navigator.mediaDevices.getUserMedia(
      this.getVgaConstraints()
    );
    this.user.stream = stream;
    this.muteVideo('#self-video');
  }

  public muteVideo(selector: string) {
    setTimeout(() => {
      const currentVideo = document.querySelector(selector);
      currentVideo && ((currentVideo as HTMLVideoElement).volume = 0);
    }, 100);
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

  public async leaveRoom() {
    await this.roomUserService.leaveRoom(this.roomId, this.user.id);
    this.router.navigate([`/`]);
  }

  public async retryCall() {
    await this.hangup();
    await this.call();
  }

  public copyLink() {
    const url = location.href;
    ClipboardService.copyTextToClipboard(url);
    this.snackBar.open(`Cсылка скопирована: ${url}`, '', {
      duration: 2000,
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
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  private getVgaConstraints(): MediaStreamConstraints {
    const video = {
      width: { exact: 320 },
      height: { exact: 240 },
      facingMode: this.isFront.value ? 'user' : 'environment',
    } as MediaTrackConstraints;

    return {
      audio: this.isAudioOn.value,
      video: this.isVideoOn.value ? video : false,
    };
  }
}
