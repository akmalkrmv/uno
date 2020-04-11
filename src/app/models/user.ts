import { rtcConfiguration } from "../constants/rts-configurations";

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;

  constructor(public userId: string) {
    this.remote = new RTCPeerConnection(rtcConfiguration);

    // Registering remote stream
    this.remote.ontrack = (event: RTCTrackEvent) => {
      console.log("ontrack", userId, event.streams);
      this.stream = event.streams[0];
    };
  }
}

export class User {
  public name?: string;
  public stream?: MediaStream;
  public connection?: RTCPeerConnection;
  public connections: Connection[] = [];

  constructor(public id: string) {}

  public getConnection(remoteUserId: string): Connection {
    const connection = this.connections.find(
      (item) => item.userId == remoteUserId
    );
    return connection || this.createConnection(remoteUserId);
  }

  public createConnection(remoteUserId: string): Connection {
    const connection = new Connection(remoteUserId);
    this.connections.push(connection);
    return connection;
  }

  public addTracks(connection: RTCPeerConnection) {
    this.stream
      .getTracks()
      .forEach((track) => connection.addTrack(track, this.stream));
  }
}
