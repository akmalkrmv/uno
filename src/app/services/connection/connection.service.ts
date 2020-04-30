import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer } from '@models/index';
import { RoomService } from '@services/repository/room.service';
import { IceCandidateService } from './ice-candidate.service';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  public user: User;

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
    const connectionRef = this.user.getConnection(reciever, name);
    const connection = connectionRef.remote;

    connectionRef.showState('offer');

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = () => {
      connectionRef.showState('offer: onicegatheringstatechange');
      this.iceCandidateService.sendIceCandidatesByGatheringState(
        connectionRef,
        caller,
        reciever
      );
    };

    await connection.setLocalDescription(
      await connection.createOffer(offerOptions)
    );

    connectionRef.showState('offer: setLocalDescription');

    this.sendOffer(caller, reciever, connection);
  }

  public async answer(caller: string, offer: Offer, name?: string) {
    const reciever = offer.from;
    const connectionRef = this.user.getConnection(reciever, name);
    const connection = connectionRef.remote;

    connectionRef.showState('answer');

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = () => {
      connectionRef.showState('answer: onicegatheringstatechange');
      this.iceCandidateService.sendIceCandidatesIfCompleted(
        connectionRef,
        caller,
        reciever
      );
    };

    try {
      if (connection.signalingState != 'stable') {
        console.log('rollback');
        await Promise.all([
          connection.setLocalDescription({ type: 'rollback' }),
          connection.setRemoteDescription(offer.description),
        ]);
      } else {
        await connection.setRemoteDescription(offer.description);
      }
      connectionRef.showState('answer: setRemoteDescription');

      setTimeout(async () => {
        await connection.setLocalDescription(
          await connection.createAnswer(offerOptions)
        );
        connectionRef.showState('answer: createAnswer, setLocalDescription');

        this.iceCandidateService
          .addIceCandidatesIfExists(this.user)
          .subscribe(() => this.sendAnswer(caller, reciever, connection));
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }

  public async setRemote(answer: Answer, name?: string) {
    const connectionRef = this.user.getConnection(answer.from, name);
    const connection = connectionRef.remote;

    connectionRef.showState('setRemote');

    try {
      await connection.setRemoteDescription(answer.description);
      connectionRef.showState('setRemote: setRemoteDescription');
    } catch (error) {
      console.log(error);
    }
  }

  private sendOffer(
    caller: string,
    reciever: string,
    connection: RTCPeerConnection
  ) {
    this.roomService
      .createOffer({
        from: caller,
        to: reciever,
        description: connection.localDescription.toJSON(),
      })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  private sendAnswer(
    caller: string,
    reciever: string,
    connection: RTCPeerConnection
  ) {
    this.roomService
      .createAnswer({
        from: caller,
        to: reciever,
        description: connection.localDescription.toJSON(),
      })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
