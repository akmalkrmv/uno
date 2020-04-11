import { Component, OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { untilDestroyed } from "ngx-take-until-destroy";
import { Observable } from "rxjs";

import {
  vgaConstraints,
  rtcConfiguration,
} from "src/app/constants/rts-configurations";
import { User } from "../../models/user";
import { RoomService } from "../../services/room.service";
import { map } from "rxjs/operators";

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
    this.logging();

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
          const connection = this.user.getConnection(offer.from).remote;
          await connection.setRemoteDescription(offer.description);

          const answer = await connection.createAnswer();
          await connection.setLocalDescription(answer);

          console.log(this.user.id, `got offer from ${offer.from}`, offer.description);
          console.log(this.user.id, `creating answer`, connection.localDescription, connection.localDescription.toJSON());

          this.roomService.createAnswer({
            to: offer.from,
            from: this.user.id,
            description: connection.localDescription.toJSON(),
          });
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
        for (const otherUser of users) {

          const connection = this.user.getConnection(otherUser.id).remote;
          this.user.addTracks(connection);

          const offer = await connection.createOffer();
          connection.setLocalDescription(offer);

          console.log(this.user.id, `creating offer to ${otherUser.id}`);

          await this.roomService.createOffer({
            from: this.user.id,
            to: otherUser.id,
            description: connection.localDescription.toJSON(),
          });
        }
      });

    // const id = await this.roomService.joinRoom(this.roomId);
    // const bob = new User(id);
    // const conncetion = bob.createConnections();

    // const { stream: currentStream } = this.user;

    // currentStream
    //   .getTracks()
    //   .forEach((track) => conncetion.local.addTrack(track, currentStream));

    // try {
    //   const offer = await conncetion.local.createOffer();
    //   conncetion.local.setLocalDescription(offer);
    //   conncetion.remote.setRemoteDescription(offer);

    //   const answer = await conncetion.remote.createAnswer();
    //   conncetion.remote.setLocalDescription(answer);
    //   conncetion.local.setRemoteDescription(answer);

    //   this.connections.push(bob);
    // } catch (error) {
    //   console.log("error on call", error);
    // }
  }

  public hangup() {}

  public muteAllVideos() {
    setTimeout(() => {
      Array.from(document.getElementsByTagName("video")).forEach(
        (video) => (video.muted = true)
      );
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
