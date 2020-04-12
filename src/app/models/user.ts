import { delimeter } from '../constants/logging';
import { Connection } from './connection';

export class User {
  public ref?: string;
  public name?: string;
  public stream?: MediaStream;
  public connections: Connection[] = [];

  constructor(public id: string) {}

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
}
