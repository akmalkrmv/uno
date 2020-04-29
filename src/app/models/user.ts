import { Connection } from './connection';
import {
  vgaConstraints,
  videoConstraints,
} from '../constants/rts-configurations';

export class User {
  public created?: number;
  public email?: string;
  public displayName?: string;
  public phoneNumber?: string;
  public photoURL?: string;
  public fcmTokens?: any;

  public uid?: string;
  public ref?: string;
  public stream?: MediaStream;
  public connections: Connection[] = [];
  public isFrontCamera = true;

  constructor(public id: string, public name?: string) {}

  public getConnection(userId: string, userName?: string): Connection {
    if (this.id === userId) {
      throw new Error('Connection Error: Attempt to connect yourself');
    }

    const connection =
      this.connections.find((item) => item.userId == userId) ||
      this.createConnection(userId);

    if (userName) {
      connection.userName = userName;
    }

    return connection;
  }

  public createConnection(userId: string): Connection {
    const connection = new Connection(userId);

    connection.remote.onconnectionstatechange = () =>
      this.onConnectionStateChange(connection);

    this.connections.push(connection);

    return connection;
  }

  public closeConnections() {
    for (const connection of this.connections) {
      connection.close();
    }

    this.connections = [];
  }

  public addTracks(connection: RTCPeerConnection) {
    try {
      console.log('Adding tracks');

      const tracks = this.stream.getTracks();
      tracks.forEach((track) => connection.addTrack(track, this.stream));
    } catch (error) {}
  }

  public toggleVideo() {
    if (this.stream) {
      this.stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  }

  public toggleAudio() {
    if (this.stream) {
      this.stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
  }

  public toggleCamera(device: MediaDeviceInfo) {
    if (this.stream) {
      this.stream.getVideoTracks().forEach((track) => track.stop());
    }

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

  private onConnectionStateChange(connection: Connection) {
    connection.showState();

    if (!connection.isConnected) {
      const index = this.connections.indexOf(connection);
      if (index >= 0) {
        connection.close();
        this.connections.splice(index, 1);
      }
    }
  }
}
