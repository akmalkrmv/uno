import { rtcConfiguration } from '../constants/rts-configurations';
import { ConnectionLogger } from '@services/connection/connection-logger.service';
import { SoundMeter } from '@utils/soundometer';
import { BehaviorSubject } from 'rxjs';

export class Connection {
  public peer: RTCPeerConnection;
  public stream?: MediaStream;
  public iceCandidates?: RTCIceCandidate[] = [];
  public audioLevel: number;
  public soundometer: SoundMeter;
  public volume$ = new BehaviorSubject(0);
  public isMuted$ = new BehaviorSubject(false);

  private stateLogger = new ConnectionLogger();
  private queueTimeout: any; //NodeJS.Timeout
  private soundTimeout: any; //NodeJS.Timeout
  private isAlive = false;

  constructor(public userId: string, public userName?: string) {
    this.peer = new RTCPeerConnection(rtcConfiguration);
    this.soundometer = new SoundMeter();
    this.logChanges();
    this.isAlive = true;
  }

  public get connectionState() {
    return this.peer.connectionState;
  }
  public get signalingState() {
    return this.peer.signalingState;
  }

  public get isConnected() {
    return (
      this.peer.connectionState == 'connecting' ||
      this.peer.connectionState == 'connected'
    );
  }

  public get canAddIceCandidate() {
    return this.peer.remoteDescription != null;
  }

  public close() {
    this.peer.close();
    this.iceCandidates = [];
    clearTimeout(this.queueTimeout);
    clearTimeout(this.soundTimeout);
    this.isAlive = false;
  }

  public showState(caller?: string) {
    this.stateLogger.showState(this.peer, caller);
  }

  public addIceCandidatesToQueue(candidates: any[]) {
    if (!candidates) return;
    if (!candidates.length) return;

    if (this.canAddIceCandidate) {
      console.log('Adding ice candidates');
      candidates.forEach((candidate) => {
        this.peer.addIceCandidate(new RTCIceCandidate(candidate));
      });
    } else {
      console.log('Ice candidates queued');
      this.queueTimeout = setTimeout(() => {
        this.addIceCandidatesToQueue(candidates);
      }, 3000);
    }
  }

  private logChanges() {
    let isNegotiating = false; // Workaround for Chrome: skip nested negotiations

    const connection = this.peer;

    // Registering remote stream
    connection.ontrack = (event: RTCTrackEvent) => {
      console.log('ontrack', event.streams);
      this.stream = event.streams[0];

      this.stream.getAudioTracks().forEach((track) => {
        track.onmute = () => this.isMuted$.next(true);
        track.onunmute = () => this.isMuted$.next(false);
      });

      if (event.track.kind === 'audio') {
        this.connectSoundometer();
      }
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
      console.log('onicecandidate', this.peer.iceGatheringState);
      this.iceCandidates.push(event.candidate);
    } else {
      this.showState('onicecandidate');
    }
  }

  private connectSoundometer() {
    const updateVolume = () => {
      const volume = Math.floor(this.soundometer.instant * 1000);
      this.volume$.next(volume);
      this.isMuted$.next(volume === 0);
      this.isAlive && requestAnimationFrame(updateVolume);
    };

    this.soundometer.connectToSource(this.stream, () => updateVolume());
  }
}
