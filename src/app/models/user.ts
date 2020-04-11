import { rtcConfiguration } from "../constants/rts-configurations";

const delimeter = "\r\n--------------------\r\n";

export class Connection {
  public remote: RTCPeerConnection;
  public stream?: MediaStream;

  constructor(public userId: string) {
    this.remote = new RTCPeerConnection(rtcConfiguration);

    // Registering remote stream
    this.remote.ontrack = (event: RTCTrackEvent) => {
      console.log("ontrack", userId, event.streams, delimeter);
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

    console.log("Looking for existing connection", remoteUserId);
    console.log(
      connection
        ? "Connection exists"
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
    console.log("Adding tracks", delimeter);

    this.stream
      .getTracks()
      .forEach((track) => connection.addTrack(track, this.stream));
  }
}
