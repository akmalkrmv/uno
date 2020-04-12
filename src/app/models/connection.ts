import { rtcConfiguration } from '../constants/rts-configurations';
import { delimeter } from '../constants/logging';

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;

  constructor(public userId: string, public userName?: string) {
    this.remote = new RTCPeerConnection(rtcConfiguration);

    const showState = () => {
      const { signalingState, connectionState } = this.remote;
      console.log('State: ', { signalingState, connectionState }, delimeter);
    };

    // Registering remote stream
    this.remote.ontrack = (event: RTCTrackEvent) => {
      console.log('ontrack', userId, event.streams, delimeter);
      this.stream = event.streams[0];
    };

    this.remote.onconnectionstatechange = (event) => {
      console.log('onconnectionstatechange');
      showState();
    };

    this.remote.onsignalingstatechange = (event) => {
      console.log('onsignalingstatechange');
      showState();
    };

    this.remote.onstatsended = (event: RTCStatsEvent) => {
      console.log('onstatsended', event);
      showState();
    };
  }
}
