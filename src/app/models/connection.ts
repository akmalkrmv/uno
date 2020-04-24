import { rtcConfiguration } from '../constants/rts-configurations';

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;
  public iceCandidates?: RTCIceCandidate[] = [];

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

  public showState() {
    const {
      signalingState,
      connectionState,
      iceConnectionState,
      iceGatheringState,
    } = this.remote;

    console.table({
      signalingState,
      connectionState,
      iceConnectionState,
      iceGatheringState,
    });
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
      console.log('onstatsended', event);
      this.showState();
    };

    connection.oniceconnectionstatechange = (event: Event) => {
      console.log('oniceconnectionstatechange', event);
      this.showState();
    };

    connection.onicecandidate = (event) => this.addIceCandidate(event);

    connection.onicegatheringstatechange = (event: Event) => {
      console.log('onicegatheringstatechange', event);
      this.showState();
    };

    connection.onsignalingstatechange = (event) => {
      console.log('onsignalingstatechange');
      this.showState();
      // Workaround for Chrome: skip nested negotiations
      isNegotiating = connection.signalingState != 'stable';
    };

    connection.onnegotiationneeded = (event) => {
      if (isNegotiating) {
        console.log('SKIP nested negotiations');
        return;
      }

      isNegotiating = true;

      // connection
      //   .createOffer()
      //   .then((offer) => connection.setLocalDescription(offer))
      //   .then(() => {
      //     // Send the offer to the remote peer through the signaling server
      //   })
      //   .catch((error) => console.log(error));
    };
  }

  private addIceCandidate(event: RTCPeerConnectionIceEvent) {
    if (event.candidate) {
      console.log('onicecandidate');
      this.iceCandidates.push(event.candidate);
    }
  }
}
