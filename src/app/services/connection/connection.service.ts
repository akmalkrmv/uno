import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer, Connection } from '@models/index';
import { RoomService } from '@services/repository/room.service';
import { IceCandidateService } from './ice-candidate.service';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  public user: User;

  private timeoutId = null;

  constructor(
    private roomService: RoomService,
    private iceCandidateService: IceCandidateService
  ) {}

  public init(user: User) {
    this.user = user;
  }

  public offerAll(callerId: string, users: User[]) {
    for (const user of users) {
      this.offer(callerId, user.id, user.name).then();
    }
  }

  public answerAll(offers: Offer[], users: User[]) {
    for (const offer of offers) {
      const user = users.find((user) => user.id == offer.from);
      const name = user ? user.name : offer.from;
      this.answer(this.user.id, offer, name).then();
    }
  }

  public setRemoteAll(answers: Answer[], users: User[]) {
    for (const answer of answers) {
      const user = users.find((user) => user.id == answer.from);
      const caller = user ? user.name : answer.from;
      this.setRemote(answer, caller).then();
    }
  }

  public async offer(caller: string, reciever: string, name?: string) {
    const connection = this.user.getConnection(reciever, name);
    const peer = connection.peer;

    if (connection.isConnected) {
      // Dont create offer to connected peer
      return;
    }

    connection.showState('offer');

    this.user.addTracks(peer);

    peer.onicegatheringstatechange = () => {
      connection.showState('offer: onicegatheringstatechange');
      this.iceCandidateService.sendIceCandidatesByGatheringState(
        connection,
        caller,
        reciever
      );
    };

    await peer.setLocalDescription(await peer.createOffer(offerOptions));

    connection.showState('offer: setLocalDescription');

    this.sendOffer(caller, reciever, peer);
  }

  public async answer(caller: string, offer: Offer, name?: string) {
    const reciever = offer.from;
    const connection = this.user.getConnection(reciever, name);
    const peer = connection.peer;

    if (connection.isConnected) {
      // Dont create answer to connected peer
      return;
    }

    connection.showState('answer');

    this.user.addTracks(peer);

    peer.onicegatheringstatechange = () => {
      connection.showState('answer: onicegatheringstatechange');
      this.iceCandidateService.sendIceCandidatesIfCompleted(
        connection,
        caller,
        reciever
      );
    };

    await this.trySetRemote(connection, offer);

    const retryCount = 3;
    this.tryCreateAnswer(connection, retryCount, () => {
      this.iceCandidateService
        .addIceCandidatesIfExists(this.user)
        .subscribe(() => this.sendAnswer(caller, reciever, peer));
    });
  }

  public async setRemote(answer: Answer, name?: string) {
    const connection = this.user.getConnection(answer.from, name);
    const peer = connection.peer;

    if (connection.isConnected) {
      // Dont setRemote to connected peer
      return;
    }

    connection.showState('setRemote');

    try {
      await peer.setRemoteDescription(answer.description);
      connection.showState('setRemote: setRemoteDescription');
    } catch (error) {
      console.log(error);
    }
  }

  private sendOffer(caller: string, reciever: string, peer: RTCPeerConnection) {
    this.roomService
      .createOffer({
        from: caller,
        to: reciever,
        description: peer.localDescription.toJSON(),
      })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  private async trySetRemote(connection: Connection, offer: Offer) {
    try {
      const peer = connection.peer;
      if (peer.signalingState != 'stable') {
        console.log('rollback');
        await Promise.all([
          peer.setLocalDescription({ type: 'rollback' }),
          peer.setRemoteDescription(offer.description),
        ]);
      } else {
        await peer.setRemoteDescription(offer.description);
      }
      connection.showState('answer: setRemoteDescription');
    } catch (error) {
      console.log(error);
    }
  }

  private tryCreateAnswer(
    connection: Connection,
    retry: number,
    callBack: Function
  ) {
    this.timeoutId && clearTimeout(this.timeoutId);

    if (retry <= 0) {
      return;
    }

    const peer = connection.peer;

    this.timeoutId = setTimeout(async () => {
      try {
        await peer.setLocalDescription(await peer.createAnswer(offerOptions));
        connection.showState('answer: createAnswer, setLocalDescription');

        callBack();
      } catch (error) {
        console.log(error);
        this.tryCreateAnswer(connection, --retry, callBack);
      }
    }, 1000);
  }

  private sendAnswer(
    caller: string,
    reciever: string,
    peer: RTCPeerConnection
  ) {
    this.roomService
      .createAnswer({
        from: caller,
        to: reciever,
        description: peer.localDescription.toJSON(),
      })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
