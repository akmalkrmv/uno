import { Injectable } from '@angular/core';
import { IOffer, IUser } from '@models/index';
import { OfferApiService } from '@services/repository/offer-api.service';
import { rtcConfiguration } from '@constants/index';

export interface ICallerData {
  user?: IUser;
  peer: RTCPeerConnection;
}

export interface ICallData {
  roomId: string;
  offer?: IOffer;
  caller: ICallerData;
  receiver: ICallerData;
}

function withDelay<T>(delay: number, action: Function) {
  return new Promise<T>((resolve, reject) => {
    const wait = setTimeout(() => {
      clearTimeout(wait);
      try {
        resolve(action() as T);
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

@Injectable({ providedIn: 'root' })
export class PeerService {
  constructor(private offerApi: OfferApiService) {}

  public createPeer(user: IUser): RTCPeerConnection {
    return new RTCPeerConnection(rtcConfiguration);
  }

  public createCall(roomId: string, caller: IUser, receiver: IUser): ICallData {
    return {
      roomId,
      caller: {
        peer: this.createPeer(caller),
        user: caller,
      },
      receiver: {
        peer: this.createPeer(receiver),
        user: receiver,
      },
    };
  }

  public async call(callData: ICallData): Promise<IOffer> {
    const roomId = callData.roomId;
    const peer = callData.caller.peer;
    const caller = callData.caller.user.id;
    const receiver = callData.receiver.user.id;

    await peer.setLocalDescription(await peer.createOffer());

    const offer: IOffer = {
      type: 'offer',
      sender: caller,
      receiver: receiver,
      description: peer.localDescription.toJSON(),
    };

    await this.offerApi.createOffer(roomId, offer);

    return offer;
  }

  public async answerToCall(callData: ICallData): Promise<IOffer> {
    const roomId = callData.roomId;
    const peer = callData.caller.peer;
    const caller = callData.caller.user.id;
    const receiver = callData.receiver.user.id;

    await peer.setRemoteDescription(callData.offer.description);
    await peer.setLocalDescription(await peer.createAnswer());

    const answer: IOffer = {
      type: 'answer',
      sender: caller,
      receiver: receiver,
      description: peer.localDescription.toJSON(),
    };

    await this.offerApi.createOffer(roomId, answer);

    return answer;
  }

  public async connect(peer: RTCPeerConnection, offer: IOffer): Promise<void> {
    await peer.setRemoteDescription(offer.description);
  }

  public async sendOffer(roomId: string, offer: IOffer) {
    await this.offerApi.createOffer(roomId, offer);
  }
}
