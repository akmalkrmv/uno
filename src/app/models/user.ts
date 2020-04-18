import { Connection } from './connection';
import {
  vgaConstraints,
  videoConstraints,
} from '../constants/rts-configurations';

export class User {
  public ref?: string;
  public stream?: MediaStream;
  public connections: Connection[] = [];
  public isFrontCamera = true;

  constructor(public id: string, public name?: string) {}

  public getConnection(userId: string): Connection {
    const connection = this.connections.find((item) => item.userId == userId);
    return connection || this.createConnection(userId);
  }

  public createConnection(userId: string): Connection {
    const connectionRef = new Connection(userId);
    const connection = connectionRef.remote;

    connection.onconnectionstatechange = () => {
      const { signalingState, connectionState } = connection;
      console.log('createConnection: onconnectionstatechange', {
        signalingState,
        connectionState,
      });

      if (
        connection.connectionState == 'failed' ||
        connection.connectionState == 'closed' ||
        connection.connectionState == 'disconnected'
      ) {
        const index = this.connections.indexOf(connectionRef);
        if (index > -1) {
          connection.close();
          this.connections.splice(index, 1);
        }
      }
    };

    this.connections.push(connectionRef);

    return connectionRef;
  }

  public closeConnections() {
    for (const connection of this.connections) {
      connection.remote.close();
    }

    this.connections = [];
  }

  public addTracks(connection: RTCPeerConnection) {
    try {
      console.log('Adding tracks');

      this.stream
        .getTracks()
        .forEach((track) => connection.addTrack(track, this.stream));
    } catch (error) {}
  }

  public toggleVideo() {
    const videoTracks = this.stream.getVideoTracks();
    if (videoTracks && videoTracks.length) {
      for (const track of videoTracks) {
        track.enabled = !track.enabled;
      }
    }
  }

  public toggleAudio() {
    const audioTracks = this.stream.getAudioTracks();
    if (audioTracks && audioTracks.length) {
      for (const track of audioTracks) {
        track.enabled = !track.enabled;
      }
    }
  }

  public toggleCamera(device: MediaDeviceInfo) {
    this.stream.getVideoTracks().forEach((track) => track.stop());

    const constaints = {
      audio: vgaConstraints.audio,
      video: {
        ...videoConstraints,
        deviceId: { exact: device.deviceId },
      },
    };

    navigator.mediaDevices.getUserMedia(constaints).then((stream) => {
      const videoTrack = stream.getVideoTracks()[0];

      this.stream = stream;
      this.connections.forEach((connection) => {
        const sender = connection.remote
          .getSenders()
          .find((sender) => sender.track.kind == videoTrack.kind);

        sender && sender.replaceTrack(videoTrack);
      });
    });
  }
}
