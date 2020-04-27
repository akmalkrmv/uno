import { rtcConfiguration } from '../constants/rts-configurations';
import { RtcStateLogger } from '@services/rtc-state-logger.service';

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;
  public iceCandidates?: RTCIceCandidate[] = [];
  public stateLogger = new RtcStateLogger();

  constructor(public userId: string, public userName?: string) {
    this.remote = new RTCPeerConnection(rtcConfiguration);
    this.logChanges();
  }

  public get connectionState() {
    return this.remote.connectionState;
  }
  public get signalingState() {
    return this.remote.signalingState;
  }

  public get isConnected() {
    return (
      this.remote.connectionState == 'connecting' ||
      this.remote.connectionState == 'connected'
    );
  }

  public get canAddIceCandidate() {
    return this.remote.remoteDescription != null;
  }

  public close() {
    this.remote.close();
    this.iceCandidates = [];
  }

  public showState(caller?: string) {
    this.stateLogger.showState(this.remote, caller);
  }

  public addIceCandidatesToQueue(candidates: any[]) {
    if (this.canAddIceCandidate) {
      console.log('Adding ice candidates');
      candidates.forEach((candidate) => {
        this.remote.addIceCandidate(new RTCIceCandidate(candidate));
      });
    } else {
      console.log('Ice candidates queued');
      setTimeout(() => {
        this.addIceCandidatesToQueue(candidates);
      }, 3000);
    }
  }

  private logChanges() {
    let isNegotiating = false; // Workaround for Chrome: skip nested negotiations

    const connection = this.remote;

    // Registering remote stream
    connection.ontrack = (event: RTCTrackEvent) => {
      console.log('ontrack', this.userId, event.streams);
      this.stream = event.streams[0];
    };

    connection.onstatsended = (event: RTCStatsEvent) => {
      this.showState('onstatsended');
    };

    connection.oniceconnectionstatechange = (event: Event) => {
      this.showState('oniceconnectionstatechange');
    };

    connection.onicecandidate = (event) => this.addIceCandidate(event);

    connection.onicegatheringstatechange = (event: Event) => {
      this.showState('onicegatheringstatechange');
    };

    connection.onsignalingstatechange = (event) => {
      this.showState('onsignalingstatechange');
      // Workaround for Chrome: skip nested negotiations
      isNegotiating = connection.signalingState != 'stable';
    };

    connection.onnegotiationneeded = (event) => {
      this.showState('onnegotiationneeded');

      if (isNegotiating) {
        console.log('SKIP nested negotiations');
        return;
      }

      isNegotiating = true;

      // Reconnect to remote
    };
  }

  private addIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      console.log('onicecandidate', this.remote.iceGatheringState);
      this.iceCandidates.push(event.candidate);
    } else {
      this.showState('onicecandidate');
    }
  }
}
