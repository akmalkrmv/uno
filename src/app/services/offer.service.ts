import { Injectable } from '@angular/core';
import { from, of } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer, Connection } from '@models/index';
import { RoomService } from '@services/repository/room.service';

@Injectable({ providedIn: 'root' })
export class OfferService {
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
      this.setRemote(answer, caller);
    }
  }

  public async offer(caller: string, reciever: string, name?: string) {
    const connectionRef = this.user.getConnection(reciever, name);
    const connection = connectionRef.remote;

    connectionRef.showState('offer');

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = () => {
      connectionRef.showState('offer: onicegatheringstatechange');
      const result$ = this.sendIceCandidates(connectionRef, caller, reciever);
      if (result$) result$.subscribe();
    };

    await connection.setLocalDescription(
      await connection.createOffer(offerOptions)
    );

    connectionRef.showState('offer: setLocalDescription');

    this.roomService
      .createOffer({
        from: caller,
        to: reciever,
        description: connection.localDescription.toJSON(),
      })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  public async answer(caller: string, offer: Offer, name?: string) {
    const reciever = offer.from;
    const connectionRef = this.user.getConnection(reciever, name);
    const connection = connectionRef.remote;

    connectionRef.showState('answer');

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = () => {
      connectionRef.showState('answer: onicegatheringstatechange');
      const result$ = this.sendIceCandidates(connectionRef, caller, reciever);
      if (result$) result$.subscribe();
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

      this.roomService
        .createAnswer({
          to: reciever,
          from: caller,
          description: connection.localDescription.toJSON(),
        })
        .pipe(take(1), catchError(this.handleError))
        .subscribe();
    } catch (error) {
      console.log(error);
    }
  }

  public async setRemote(answer: Answer, name?: string) {
    const connectionRef = this.user.getConnection(answer.from, name);
    const connection = connectionRef.remote;

    connectionRef.showState('setRemote');

    try {
      // if (connection.signalingState == 'stable')
      await connection.setRemoteDescription(answer.description);
      connectionRef.showState('setRemote: setRemoteDescription');
    } catch (error) {
      console.log(error);
    }
  }

  private sendIceCandidates(
    connection: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!connection) return;
    if (!connection.remote) return;
    if (connection.remote.iceGatheringState === 'complete') return;

    if (!connection.iceCandidates) return;
    if (!connection.iceCandidates.length) return;

    if (!senderId) return;
    if (!recieverId) return;

    const candidates = connection.iceCandidates.map((c) => c.toJSON());
    const payload = { senderId, recieverId, candidates };

    console.log('sending IceCandidates');
    return this.roomService
      .addIceCandidate(payload)
      .pipe(take(1), catchError(this.handleError));
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
