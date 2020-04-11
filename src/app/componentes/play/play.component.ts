import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Observable } from "rxjs";

import {
  vgaConstraints,
  rtcConfiguration,
} from "src/app/constants/rts-configurations";
import { User } from "../../models/user";
import { RoomService } from "../../services/room.service";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.scss"],
})
export class PlayComponent implements OnInit, OnDestroy {
  @ViewChild("container") container: ElementRef<HTMLElement>;

  public roomId: string;
  public userId: string;
  public user: User;
  public connections: User[] = [];
  public users: Observable<any>;

  public localStream: MediaStream;
  private offer$ = new EventEmitter<RTCSessionDescriptionInit>();
  private answer$ = new EventEmitter<RTCSessionDescriptionInit>();

  constructor(private roomService: RoomService) {}

  ngOnDestroy() {}

  async ngOnInit() {
    await this.fetchUserId();
    await this.start();

  
    // this.roomService
    //   .roomOffers(this.roomId)
    //   .pipe(untilDestroyed(this))
    //   .subscribe((offers) => {
    //     console.log("offers", offers);

    //     offers = offers.filter((offer) => offer.senderId !== this.userId);
    //     const lastOffer = offers[offers.length - 1];

    //     if (lastOffer) {
    //       this.handleOffer(lastOffer.description);
    //     }
    //   });

    // this.roomService
    //   .roomAnswers(this.roomId)
    //   .pipe(untilDestroyed(this))
    //   .subscribe((answers) => {
    //     console.log("answers", answers);

    //     answers = answers.filter((answer) => answer.senderId !== this.userId);
    //     const lastAnswer = answers[answers.length - 1];

    //     if (lastAnswer) {
    //       this.handleAnswer(lastAnswer.description);
    //     }
    //   });

    this.offer$
      .pipe(untilDestroyed(this))
      .subscribe(async (offer: RTCSessionDescriptionInit) =>
        this.handleOffer(offer)
      );

    this.answer$
      .pipe(untilDestroyed(this))
      .subscribe((answer: RTCSessionDescriptionInit) =>
        this.handleAnswer(answer)
      );

    // this.chatService.messages
    //   .pipe(untilDestroyed(this))
    //   .subscribe((message) => this.onMessage(message));
  }

  public async fetchUserId() {
    if (localStorage.getItem("uno-client-id")) {
      this.userId = localStorage.getItem("uno-client-id");
    } else {
      this.userId = await this.roomService.joinRoom(this.roomId);
      localStorage.setItem("uno-client-id", this.userId);
    }
  }

  public async start() {
    this.user = this.createUser();

    const stream = await navigator.mediaDevices.getUserMedia(vgaConstraints);
    const tracks = stream.getTracks();

    for (const track of tracks) {
      this.user.connection.addTrack(track, stream);
    }

    this.localStream = stream;
    this.muteAllVideos();
  }

  public async call() {
    const offer = await this.user.connection.createOffer();
    await this.user.connection.setLocalDescription(offer);

    // this.chatService.messages.next({
    //   type: "offer",
    //   senderId: this.user.id,
    //   data: this.user.connection.localDescription,
    // });

    // this.roomService.createOffer(this.roomId, this.user);
  }

  public hangup() {
    console.log("Ending call");

    this.connections.forEach((user) => {
      user.connection.close();
      // user.connceted = false;
    });
  }

  public muteAllVideos() {
    setTimeout(() => {
      const videos = Array.from(document.getElementsByTagName("video"));
      for (const video of videos) {
        video.muted = true;
      }
    }, 100);
  }

  private createUser(): User {
    const user = new User(this.userId);

    // Creating connection object
    user.connection = new RTCPeerConnection(rtcConfiguration);

    // Rendering stream
    user.connection.ontrack = (event: RTCTrackEvent) => {
      console.log("ontrack", event.streams);
      user.stream = event.streams[0];
    };

    return user;
  }

  private onMessage(message) {
    console.log("message", message);

    if (message.senderId == this.user.id) {
      return;
    }

    switch (message.type) {
      case "offer":
        this.offer$.next(message.data);
        break;
      case "answer":
        this.answer$.next(message.data);
        break;
    }
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    try {
      await this.user.connection.setRemoteDescription(offer);

      const answer = await this.user.connection.createAnswer();
      await this.user.connection.setLocalDescription(answer);

      // this.chatService.messages.next({
      //   type: "answer",
      //   senderId: this.user.id,
      //   data: this.user.connection.localDescription,
      // });

      // this.roomService.createAnswer(this.roomId, this.user);
    } catch (error) {
      console.log(error);
    }
  }

  private handleAnswer(answer: RTCSessionDescriptionInit) {
    try {
      console.log("answer$", answer);
      this.user.connection.setRemoteDescription(answer);
    } catch (error) {
      console.log(error);
    }
  }
}
