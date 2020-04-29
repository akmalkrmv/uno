import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer, Connection, IceCandidate } from '@models/index';
import { RoomService } from '@services/repository/room.service';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  public user: User;

  constructor(private roomService: RoomService) {}

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
      this.sendIceCandidates(connectionRef, caller, reciever);
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
      this.sendIceCandidates(connectionRef, caller, reciever);
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

      await connection.setLocalDescription(
        await connection.createAnswer(offerOptions)
      );

      connectionRef.showState('answer: createAnswer, setLocalDescription');

      this.addIceCandidatesIfExists().subscribe(async () => {
        this.sendAnswer(caller, reciever, connection);
      });
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

  private sendIceCandidates(
    connection: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!connection) return;
    if (!connection.remote) return;
    if (connection.remote.iceGatheringState !== 'complete') return;

    if (!connection.iceCandidates) return;
    if (!connection.iceCandidates.length) return;

    if (!senderId) return;
    if (!recieverId) return;

    const candidates = connection.iceCandidates.map((c) => c.toJSON());
    const payload = { senderId, recieverId, candidates };

    console.log('sending IceCandidates');
    this.roomService
      .addIceCandidate(payload)
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  private addIceCandidatesIfExists() {
    return this.roomService
      .userIceCandidates(this.user.id)
      .pipe(take(1))
      .pipe(
        tap((iceCandidates) => {
          if (iceCandidates && iceCandidates.length) {
            this.addIceCandidates(iceCandidates);
          }
        })
      );
  }

  private addIceCandidates(iceCandidates: IceCandidate[]) {
    console.log('Got ice candidates', iceCandidates);

    iceCandidates.map((ice) => {
      const connectionRef = this.user.getConnection(ice.recieverId);
      connectionRef.addIceCandidatesToQueue(ice.candidates);
    });
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
