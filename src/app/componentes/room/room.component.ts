import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Observable } from "rxjs";

import { vgaConstraints } from "src/app/constants/rts-configurations";
import { User } from "../../models/user";
import { RoomService } from "../../services/room.service";
import { map } from "rxjs/operators";

const delimeter = "\r\n--------------------\r\n";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit, OnDestroy {
  public roomId: string;
  public userId: string;
  public user: User;
  public connections: User[] = [];
  public users: Observable<any>;
  public localStream: MediaStream;

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
    await this.start();

    this.roomService
      .userOffers(userId)
      .pipe(
        untilDestroyed(this),
        map((offers) => offers.filter((offer) => offer.from != this.user.id))
      )
      .subscribe(async (offers) => {
        for (const offer of offers) {
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
      });

    this.roomService
      .userAnswers(userId)
      .pipe(
        untilDestroyed(this),
        map((answers) =>
          answers.filter((answer) => answer.from != this.user.id)
        )
      )
      .subscribe(async (answers) => {
        for (const answer of answers) {
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
      });
  }

  public async start() {
    const stream = await navigator.mediaDevices.getUserMedia(vgaConstraints);
    this.user.stream = stream;
    this.muteAllVideos();
  }

  public async call() {
    this.onlineUsers$
      .pipe(
        untilDestroyed(this),
        map((users) => users.filter((user) => user.id != this.user.id))
      )
      .subscribe(async (users) => {
        for (const target of users) {
          const connection = this.user.getConnection(target.id).remote;
          this.user.addTracks(connection);

          console.log("Creating offer to ", target.id);
          console.log("Setting remote description", delimeter);

          const offer = await connection.createOffer();
          connection.setLocalDescription(offer);

          await this.roomService.createOffer({
            from: this.user.id,
            to: target.id,
            description: connection.localDescription.toJSON(),
          });
        }
      });
  }

  public hangup() {}

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
