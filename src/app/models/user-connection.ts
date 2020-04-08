export class UserConnection {
  public name?: string;
  public stream?: MediaStream;
  public streamSrc?: string;
  public connection?: RTCPeerConnection;
  public connceted: false;

  constructor(public id: string) {}
}
