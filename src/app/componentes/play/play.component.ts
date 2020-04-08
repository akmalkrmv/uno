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

import { ChatService } from "src/app/services/chat.service";
import { UserConnection } from "../../models/user-connection";
import {
  vgaConstraints,
  rtcConfiguration,
} from "src/app/constants/rts-configurations";

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.scss"],
})
export class PlayComponent implements OnInit, OnDestroy {
  @ViewChild("container") container: ElementRef<HTMLElement>;

  public roomId: string;
  public user: UserConnection;
  public connections: UserConnection[] = [];

  private localStream: MediaStream;
  private offer$ = new EventEmitter<RTCSessionDescriptionInit>();
  private answer$ = new EventEmitter<RTCSessionDescriptionInit>();

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnDestroy() {}

  async ngOnInit() {
    this.handleRouteParams();

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

    this.chatService.messages
      .pipe(untilDestroyed(this))
      .subscribe((message) => this.onMessage(message));

    await this.start();
  }

  public async start() {
    this.user = this.createUser();

    const stream = await navigator.mediaDevices.getUserMedia(vgaConstraints);
    const tracks = stream.getTracks();

    for (const track of tracks) {
      this.user.connection.addTrack(track, stream);
    }

    this.localStream = stream;
    this.user.stream = stream;
    this.connections.push(this.user);

    this.muteAllVideos();
  }

  public async call() {
    const offer = await this.user.connection.createOffer();
    await this.user.connection.setLocalDescription(offer);

    this.chatService.messages.next({
      type: "offer",
      senderId: this.user.id,
      data: this.user.connection.localDescription,
    });
  }

  public hangup() {
    console.log("Ending call");

    this.connections.forEach((user) => {
      user.connection.close();
      user.connceted = false;
      user.stream = this.localStream;
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

  private handleRouteParams() {
    this.activeRoute.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has("id")) {
          this.roomId = paramMap.get("id");
        } else {
          this.router.navigate([this.newid()]);
        }
      });
  }

  private createUser(): UserConnection {
    const user = new UserConnection(this.newid());

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

      this.chatService.messages.next({
        type: "answer",
        senderId: this.user.id,
        data: this.user.connection.localDescription,
      });
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

  // TODO: Improve id generator
  private newid(): string {
    return Math.floor(Math.random() * 1000000 + 1000000).toString();
  }
}
