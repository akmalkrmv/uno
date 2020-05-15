import { BehaviorSubject, Subscription, Subject } from 'rxjs';
import { IOffer, IceCandidate } from '@models/index';
import { rtcConfiguration } from '@constants/index';
import { ConnectionLogger } from './connection-logger.service';

export interface ISignallingService {
  sendOffer(offer: IOffer): Promise<void>;
  sendIceCandidate(iceCandidate: IceCandidate): Promise<void>;
  onOffer: (offer: IOffer) => void;
  onIceCandidates: (iceCandidate: IceCandidate) => void;
}

export interface IConnectionService {
  createConnection(
    caller: string,
    receiver: string
  ): Promise<RTCPeerConnection>;
  call(caller, receiver): Promise<void>;
  addTracks(caller, stream): void;
  onConnect: (connection) => void;
}

export class SignallingService implements ISignallingService {
  private offers$ = new BehaviorSubject<IOffer[]>([]);
  private candidates$ = new BehaviorSubject<IceCandidate[]>([]);
  private lastOffer$ = new Subject<IOffer>();
  private lastCandidate$ = new Subject<IceCandidate>();
  private subscriptions: Subscription[] = [];

  constructor() {
    this.subscriptions.push(
      this.lastOffer$.subscribe((offer) => this.onOffer(offer))
    );
    this.subscriptions.push(
      this.lastCandidate$.subscribe((candidate) =>
        this.onIceCandidates(candidate)
      )
    );
  }

  destroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  sendOffer(offer: IOffer): Promise<void> {
    this.offers$.next([...this.offers$.value, offer]);
    this.lastOffer$.next(offer);
    return Promise.resolve();
  }

  sendIceCandidate(iceCandidate: IceCandidate): Promise<void> {
    this.candidates$.next([...this.candidates$.value, iceCandidate]);
    this.lastCandidate$.next(iceCandidate);
    return Promise.resolve();
  }

  onOffer: (offer: IOffer) => void;
  onIceCandidates: (iceCandidate: IceCandidate) => void;
}

export class Connection {
  private isPolite = false;
  private isMakingOffer = false;
  private logger = new ConnectionLogger();

  constructor(private id: string) {
  }

  public onConnect: (connection: any) => void;

}

export class ConnectionService implements IConnectionService {
  private connections: Record<string, RTCPeerConnection> = {};
  private isPolite = false;
  private isMakingOffer = false;
  private logger = new ConnectionLogger();

  constructor(private signalling: ISignallingService) {
    this.signalling.onOffer = (offer) => this.handleOffer(offer);
  }

  public onConnect: (connection: any) => void;

  public addTracks(id: string, stream: MediaStream): void {
    const peer = this.connections[id];
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
  }

  public async createConnection(
    caller: string,
    receiver: string
  ): Promise<RTCPeerConnection> {
    if (!this.connections[caller]) {
      this.connections[caller] = this.createPeer();
    }
    if (!this.connections[receiver]) {
      this.connections[receiver] = this.createPeer();
    }

    const logger = this.logger;

    this.connections[caller].onnegotiationneeded = () => {
      logger.showState(this.connections[caller], 'onnegotiationneeded');
      this.call(caller, receiver);
    };

    this.connections[receiver].onnegotiationneeded = () => {
      logger.showState(this.connections[caller], 'onnegotiationneeded');
      this.call(receiver, caller);
    };

    return this.connections[caller];
  }

  public async call(caller: string, receiver: string): Promise<void> {
    const peer = this.connections[caller];

    try {
      console.log('call');
      this.isMakingOffer = true;
      const offer = await peer.createOffer();
      if (peer.signalingState != 'stable') return;
      await peer.setLocalDescription(offer);

      this.signalling.sendOffer({
        type: 'offer',
        sender: caller,
        receiver: receiver,
        description: peer.localDescription.toJSON(),
      });
    } catch (error) {
      console.log(`call ${error}`);
    } finally {
      this.isMakingOffer = false;
    }

    return Promise.resolve();
  }

  private async handleOffer(offer: IOffer) {
    const isOffer = offer.type == 'offer';
    const peer = isOffer
      ? this.connections[offer.sender]
      : this.connections[offer.receiver];

    const isStable = peer.signalingState == 'stable';
    const offerCollision = isOffer && (this.isMakingOffer || !isStable);
    const ignoreOffer = !this.isPolite && offerCollision;

    console.log('handleOffer', { offer, offerCollision, ignoreOffer });

    if (ignoreOffer) {
      return;
    }

    if (offerCollision) {
      await Promise.all([
        peer.setLocalDescription({ type: 'rollback' }),
        peer.setRemoteDescription(offer.description),
      ]);
    } else {
      await peer.setRemoteDescription(offer.description);
    }

    if (offer.type == 'offer') {
      await peer.setLocalDescription(await peer.createAnswer());
      this.signalling.sendOffer({
        type: 'answer',
        sender: offer.receiver,
        receiver: offer.sender,
        description: peer.localDescription.toJSON(),
      });
    }
  }


  
  private createPeer() {
    const logger = this.logger;
    const peer = new RTCPeerConnection(rtcConfiguration);

    peer.onconnectionstatechange = () => {
      logger.showState(peer, 'onconnectionstatechange');

      if (peer.connectionState == 'connected') {
        this.onConnect(peer.connectionState);
      }
    };

    peer.onsignalingstatechange = () =>
      logger.showState(peer, 'onsignalingstatechange');
    peer.onicegatheringstatechange = () =>
      logger.showState(peer, 'onicegatheringstatechange');
    peer.oniceconnectionstatechange = () =>
      logger.showState(peer, 'oniceconnectionstatechange');

    return peer;
  }
}
