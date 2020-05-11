import { BehaviorSubject } from 'rxjs';
import { Connection } from './connection';
import {
  vgaConstraints,
  videoConstraints,
} from '../constants/rts-configurations';

// TODO: A BIG TODO!!!
export class User {
  public photoURL?: string;
  public stream?: MediaStream;
  public connections: Connection[] = [];
  public isFrontCamera = true;
  // TODO: move from here
  public messages$ = new BehaviorSubject('');

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

    connection.peer.onconnectionstatechange = () =>
      this.onConnectionStateChange(connection);

    connection.peer.ondatachannel = (event) => {
      event.channel.onmessage = (message: MessageEvent) => {
        console.log('onmessage', message.data);
        this.messages$.next(message.data);
      };
    };

    this.connections.push(connection);

    return connection;
  }

  public closeConnections() {
    for (const connection of this.connections) {
      connection.close();
    }

    this.connections = [];
  }

  public closeConnection(userId: string) {
    const index = this.connections.findIndex(
      (connection) => (connection.userId = userId)
    );

    if (index >= 0) {
      this.connections[index].close();
      this.connections.splice(index, 1);
    }
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
      this.replaceTrack(videoTrack);
    });
  }

  public replaceTrack(videoTrack: MediaStreamTrack) {
    this.connections.forEach((connection) => {
      const senders = connection.peer.getSenders();
      const sender = senders.find(
        (sender) => sender.track.kind == videoTrack.kind
      );
      sender && sender.replaceTrack(videoTrack);
    });
  }

  private onConnectionStateChange(connection: Connection) {
    connection.showState();

    const state = connection.peer.connectionState;

    if (state === 'disconnected' || state === 'failed') {
      const index = this.connections.indexOf(connection);
      if (index >= 0) {
        connection.close();
        this.connections.splice(index, 1);
      }
    }
  }
}
