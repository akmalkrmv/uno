import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  EventEmitter,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ChatService } from "src/app/services/chat.service";
import { map, filter } from "rxjs/operators";

const vgaConstraints: MediaStreamConstraints = {
  audio: true,
  video: { width: { exact: 320 }, height: { exact: 240 } },
};

const offerOptions: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};

@Component({
  selector: "app-play",
  templateUrl: "./play.component.html",
  styleUrls: ["./play.component.scss"],
})
export class PlayComponent implements OnInit {
  @ViewChild("container") container: ElementRef<HTMLElement>;

  public roomId: string;
  public userId: string;

  public offer$ = new EventEmitter<RTCSessionDescriptionInit>();
  public answer$ = new EventEmitter<RTCSessionDescriptionInit>();

  private localStream: MediaStream;
  private localConnection: RTCPeerConnection;
  private remoteConnection: RTCPeerConnection;
  private remoteConnections: Record<string, RTCPeerConnection> = {};

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    this.userId = this.newid();

    this.activeRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has("id")) {
        return this.router.navigate([this.newid()]);
      }

      this.roomId = paramMap.get("id");
    });

    this.offer$.subscribe(async (offer: RTCSessionDescriptionInit) => {
      await this.localConnection.setRemoteDescription(offer);

      const answer = await this.localConnection.createAnswer();
      await this.localConnection.setLocalDescription(answer);

      // this.answer$.emit(this.localConnection.localDescription);
      this.chatService.messages.next({
        type: "answer",
        senderId: this.userId,
        data: this.localConnection.localDescription,
      });
    });

    this.answer$.subscribe((answer: RTCSessionDescriptionInit) => {
      console.log("answer$", answer);
      this.localConnection.setRemoteDescription(answer);
    });

    this.chatService.messages.subscribe((message) => {
      console.log("message", message);

      if (message.senderId == this.userId) {
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
    });
  }

  public async start() {
    const local = this.createConnection();
    const stream = await navigator.mediaDevices.getUserMedia(vgaConstraints);

    stream.getTracks().forEach((track) => local.addTrack(track, stream));

    this.localStream = stream;
    this.localConnection = local;

    this.appendVideo(stream);
  }

  public async call() {
    // const remote = this.createConnection();

    // this.remoteConnection = remote;
    // this.remoteConnections[this.newid()] = remote;

    const offer = await this.localConnection.createOffer();
    await this.localConnection.setLocalDescription(offer);

    // this.offer$.emit(remote.localDescription);
    this.chatService.messages.next({
      type: "offer",
      senderId: this.userId,
      data: this.localConnection.localDescription,
    });

    this.chatService.messages.next({
      type: "other",
      senderId: this.userId,
      data: "test",
    });

    // for (const key in this.remoteConnections) {
    //   this.connect(this.localConnection, this.remoteConnections[key]);
    // }

    // const configuration = {};
    // const local = new RTCPeerConnection(configuration);
    // const remote = new RTCPeerConnection(configuration);
    // local.onicecandidate = (event) => this.onIceCandidate(local, event);
    // remote.onicecandidate = (event) => this.onIceCandidate(remote, event);
    // remote.ontrack = (event) => this.appendVideo(event.streams[0]);

    // stream.getTracks().forEach((track) => local.addTrack(track, stream));

    // try {
    //   console.log("local createOffer start");
    //   const offer = await local.createOffer(offerOptions);
    //   await this.onCreateOfferSuccess(offer);
    // } catch (e) {
    //   this.onCreateSessionDescriptionError(e);
    // }
  }

  public hangup() {
    console.log("Ending call");
    this.localConnection && this.localConnection.close();
    this.remoteConnection && this.remoteConnection.close();
    this.localConnection = null;
    this.remoteConnection = null;
    document.querySelector("video:last-child").remove();
  }

  private createConnection(): RTCPeerConnection {
    // TODO: create higher level constant
    const configuration = {};

    // Creating connection object
    const connection = new RTCPeerConnection(configuration);

    // Rendering stream
    connection.ontrack = (event: RTCTrackEvent) =>
      this.appendVideo(event.streams[0]);

    return connection;
  }

  private async connect(local: RTCPeerConnection, remote: RTCPeerConnection) {
    const offer = await local.createOffer();
    await local.setLocalDescription(offer);
    await remote.setRemoteDescription(local.localDescription);

    const answer = await remote.createAnswer();
    await remote.setLocalDescription(answer);
    await local.setRemoteDescription(remote.localDescription);

    remote.ontrack = (event: RTCTrackEvent) =>
      this.appendVideo(event.streams[0]);
  }

  private appendVideo(stream: MediaStream) {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.muted = true;
    video.controls = true;
    video.play();

    this.container.nativeElement.appendChild(video);
  }

  private newid(): string {
    return Math.floor(Math.random() * 1000000 + 1000000).toString();
  }

  private async onIceCandidate(
    connection: RTCPeerConnection,
    event: RTCPeerConnectionIceEvent
  ) {
    try {
      await this.getOtherConncetion(connection).addIceCandidate(
        event.candidate
      );
      this.onAddIceCandidateSuccess(connection);
    } catch (e) {
      this.onAddIceCandidateError(connection, event);
    }

    console.log(
      `${this.getName(connection)} ICE candidate:\n${
        event.candidate ? event.candidate.candidate : "(null)"
      }`
    );
  }

  private onAddIceCandidateSuccess(connection: RTCPeerConnection) {
    console.log(`${this.getName(connection)} addIceCandidate success`);
  }

  private onAddIceCandidateError(connection: RTCPeerConnection, error) {
    console.log(
      `${this.getName(
        connection
      )} failed to add ICE Candidate: ${error.toString()}`
    );
  }

  private getOtherConncetion(connection: RTCPeerConnection) {
    return connection === this.localConnection
      ? this.remoteConnection
      : this.localConnection;
  }

  private async onCreateOfferSuccess(sdc: RTCSessionDescriptionInit) {
    let local = this.localConnection;
    let remote = this.remoteConnection;

    console.log(`Offer from local\n${sdc.sdp}`);
    console.log("local setLocalDescription start");

    try {
      await local.setLocalDescription(sdc);
      this.onSetLocalSuccess(local);
    } catch (e) {
      this.onSetSessionDescriptionError();
    }

    console.log("remote setRemoteDescription start");
    try {
      await remote.setRemoteDescription(sdc);
      this.onSetRemoteSuccess(remote);
    } catch (e) {
      this.onSetSessionDescriptionError();
    }

    console.log("remote createAnswer start");
    try {
      const answer = await remote.createAnswer();
      await this.onCreateAnswerSuccess(answer);
    } catch (e) {
      this.onCreateSessionDescriptionError(e);
    }
  }

  private onSetLocalSuccess(connection: RTCPeerConnection) {
    console.log(`${this.getName(connection)} setLocalDescription complete`);
  }

  private onSetRemoteSuccess(connection: RTCPeerConnection) {
    console.log(`${this.getName(connection)} setRemoteDescription complete`);
  }

  private getName(connection: RTCPeerConnection) {
    return connection === this.localConnection ? "local" : "remote";
  }

  private async onCreateAnswerSuccess(desc: RTCSessionDescriptionInit) {
    let local = this.localConnection;
    let remote = this.remoteConnection;

    console.log(`Answer from remote:\n${desc.sdp}`);
    console.log("remote setLocalDescription start");
    try {
      await remote.setLocalDescription(desc);
      this.onSetLocalSuccess(remote);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
    console.log("local setRemoteDescription start");
    try {
      await local.setRemoteDescription(desc);
      this.onSetRemoteSuccess(local);
    } catch (e) {
      this.onSetSessionDescriptionError(e);
    }
  }

  private onSetSessionDescriptionError(error?) {
    console.log(
      `Failed to set session description: ${error && error.toString()}`
    );
  }

  private onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }
}
