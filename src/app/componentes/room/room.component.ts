import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Observable } from "rxjs";

import { vgaConstraints } from "src/app/constants/rts-configurations";
import { User } from "../../models/user";
import { RoomService } from "../../services/room.service";
import { Offer, Answer } from "src/app/models/room";
import { delimeter } from "src/app/constants/logging";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId: string;
  public user: User;
  public onlineUsers$: Observable<User[]>;

  constructor(
    private roomService: RoomService,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {}

  async ngOnInit() {
    this.roomId = this.activeRoute.snapshot.paramMap.get("id");
    this.roomService.init(this.roomId);
    this.onlineUsers$ = this.roomService.users$;
    // this.logging();

    const userId = await this.fetchUserId();
    this.user = new User(userId);
    await this.startSelfStream();

    this.roomService
      .userOffers(userId)
      .pipe(untilDestroyed(this))
      .subscribe(async (offers) => {
        for (const offer of offers) {
          await this.answerToOffer(offer);
          // Call back when someone calls
          await this.createOfferToUser(this.user.id, offer.from);
        }
      });

    this.roomService
      .userAnswers(userId)
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
    this.roomService
      .otherUsers(this.user.id)
      .pipe(untilDestroyed(this))
      .subscribe(async (users) => {
        for (const user of users) {
          await this.createOfferToUser(this.user.id, user.id);
        }
      });
  }

  public async hangup() {
    for (const connection of this.user.connections) {
      connection.remote.close();
    }

    this.user.connections = [];
    await this.roomService.clearConnections();
  }

  public async createOfferToUser(from: string, to: string) {
    try {
      const connection = this.user.getConnection(to).remote;
      this.user.addTracks(connection);

      console.log("Creating offer to ", to);
      console.log("Setting remote description", delimeter);

      const offer = await connection.createOffer();
      connection.setLocalDescription(offer);

      await this.roomService.createOffer({
        from,
        to,
        description: connection.localDescription.toJSON(),
      });
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public async answerToOffer(offer: Offer) {
    try {
      console.log("Got offer from", offer.from);
      console.log("Setting remote description");

      const connection = this.user.getConnection(offer.from).remote;
      await connection.setRemoteDescription(offer.description);

      console.log("Creating answer");
      console.log("Setting local description", delimeter);

      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);

      this.roomService.createAnswer({
        to: offer.from,
        from: this.user.id,
        description: connection.localDescription.toJSON(),
      });
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public async handleAnswer(answer: Answer) {
    try {
      console.log("Got answer from", answer.from);
      console.log("Setting remote description", delimeter);

      const connection = this.user.getConnection(answer.from).remote;
      await connection.setRemoteDescription(answer.description);

      this.muteAllVideos();
    } catch (error) {
      console.log(error, delimeter);
    }
  }

  public muteAllVideos() {
    setTimeout(() => {
      console.log("Muting all sounds", delimeter);

      const videos = Array.from(document.getElementsByTagName("video"));
      videos.forEach((video) => (video.muted = true));
    }, 100);
  }

  public async fetchUserId(): Promise<string> {
    if (localStorage.getItem("uno-client-id")) {
      return localStorage.getItem("uno-client-id");
    }

    const userId = await this.roomService.joinRoom(this.roomId);
    localStorage.setItem("uno-client-id", userId);

    return userId;
  }

  private logging() {
    this.roomService.users$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log("users", items);
    });

    this.roomService.offers$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log("offers", items);
    });

    this.roomService.answers$.pipe(untilDestroyed(this)).subscribe((items) => {
      console.log("answers", items);
    });

    this.roomService
      .userJoined(this.roomId)
      .pipe(untilDestroyed(this))
      .subscribe((users) => {
        console.log("joind: ", users);
      });
  }
}
