import { delimeter } from '../constants/logging';
import { Connection } from './connection';

export class User {
  public ref?: string;
  public stream?: MediaStream;
  public connections: Connection[] = [];

  constructor(public id: string, public name?: string) {}

  public getConnection(remoteUserId: string): Connection {
    const connection = this.connections.find(
      (item) => item.userId == remoteUserId
    );

    console.log('Looking for existing connection', remoteUserId);
    console.log(
      connection
        ? 'Connection exists'
        : "Connection doesn't exists, creating new connection",
      delimeter
    );

    return connection || this.createConnection(remoteUserId);
  }

  public createConnection(remoteUserId: string): Connection {
    const connection = new Connection(remoteUserId);
    this.connections.push(connection);
    return connection;
  }

  public addTracks(connection: RTCPeerConnection) {
    try {
      console.log('Adding tracks', delimeter);

      this.stream
        .getTracks()
        .forEach((track) => connection.addTrack(track, this.stream));
    } catch (error) {}
  }

  public toggleVideo() {
    const videoTracks = this.stream.getVideoTracks();
    if (!videoTracks.length) {
      return;
    }

    for (const track of videoTracks) {
      track.enabled = !track.enabled;
    }
  }

  public toggleAudio() {
    const audioTracks = this.stream.getAudioTracks();
    if (!audioTracks.length) {
      return;
    }

    for (const track of audioTracks) {
      track.enabled = !track.enabled;
    }
  }
}
