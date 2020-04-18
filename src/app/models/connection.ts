import { rtcConfiguration } from '../constants/rts-configurations';

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;

  constructor(public userId: string, public userName?: string) {
    let isNegotiating = false; // Workaround for Chrome: skip nested negotiations

    const connection = new RTCPeerConnection(rtcConfiguration);
    const showState = () => {
      const { signalingState, connectionState } = connection;
      console.log('State: ', { signalingState, connectionState });
    };

    // Registering remote stream
    connection.ontrack = (event: RTCTrackEvent) => {
      console.log('ontrack', userId, event.streams);
      this.stream = event.streams[0];
    };

    connection.onsignalingstatechange = (event) => {
      console.log('onsignalingstatechange');
      showState();
      // Workaround for Chrome: skip nested negotiations
      isNegotiating = connection.signalingState != 'stable';
    };

    connection.onstatsended = (event: RTCStatsEvent) => {
      console.log('onstatsended', event);
      showState();
    };

    connection.onnegotiationneeded = (event) => {
      if (isNegotiating) {
        console.log('SKIP nested negotiations');
        return;
      }
      isNegotiating = true;
      // try {
      //   await pc1.setLocalDescription(await pc1.createOffer());
      //   await pc2.setRemoteDescription(pc1.localDescription);
      //   await pc2.setLocalDescription(await pc2.createAnswer());
      //   await pc1.setRemoteDescription(pc2.localDescription);
      // } catch (e) {
      //   console.log(e);
      // }
    };

    this.remote = connection;
  }
}
