import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer } from '@models/index';
import { RoomService } from '@services/repository/room.service';

@Injectable({ providedIn: 'root' })
export class OfferService {
  public user: User;

  constructor(private roomService: RoomService) {}

  public init(user: User) {
    this.user = user;
  }

  public createOfferToUser(
    fromId: string,
    toId: string,
    userName?: string
  ): Observable<string> {
    const connectionRef = this.user.getConnection(toId);
    const connection = connectionRef.remote;

    if (userName) {
      connectionRef.userName = userName;
    }

    this.user.addTracks(connection);

    connection.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
      if (!event.candidate) return;

      console.log('onicecandidate');

      this.roomService.addIceCandidate({
        senderId: fromId,
        recieverId: toId,
        candidate: event.candidate.toJSON(),
      });
    };

    // if (
    //   connection.connectionState === 'connected' ||
    //   connection.connectionState === 'connecting'
    // ) {
    //   return of(null);
    // }

    const { connectionState, signalingState } = connection;
    console.log({ connectionState, signalingState });

    const action = async () => {
      const offer = await connection.createOffer(offerOptions);
      await connection.setLocalDescription(offer);
      return connection.localDescription.toJSON();
    };

    return from(action()).pipe(
      switchMap((description) =>
        this.roomService.createOffer({ from: fromId, to: toId, description })
      ),
      catchError((error) => (console.log(error), of(null)))
    );
  }

  public answerToOffer(offer: Offer, userName?: string): Observable<string> {
    const connectionRef = this.user.getConnection(offer.from);
    const connection = connectionRef.remote;

    if (userName) {
      connectionRef.userName = userName;
    }

    // if (
    //   connection.currentRemoteDescription !== null ||
    //   connection.connectionState === 'connected' ||
    //   connection.connectionState === 'connecting'
    // ) {
    //   return of(null);
    // }

    const { connectionState, signalingState } = connection;
    console.log({ connectionState, signalingState });

    const action = async () => {
      await connection.setRemoteDescription(offer.description);
      const answer = await connection.createAnswer(offerOptions);
      await connection.setLocalDescription(answer);
      return connection.localDescription.toJSON();
    };

    return from(action()).pipe(
      switchMap((description) => {
        console.log('answering...', description);
        const payload = { to: offer.from, from: this.user.id, description };
        return this.roomService.createAnswer(payload);
      }),
      catchError((error) => (console.log(error), of(null)))
    );
  }

  public handleAnswer(answer: Answer, userName?: string): Observable<void> {
    const connectionRef = this.user.getConnection(answer.from);
    const connection = connectionRef.remote;

    connection.currentRemoteDescription;

    if (userName) {
      connectionRef.userName = userName;
    }

    if (
      // connection.currentRemoteDescription !== null ||
      connection.connectionState === 'new'
      // connection.connectionState === 'connected' ||
      // connection.connectionState === 'connecting'
    ) {
      return of(null);
    }

    const { connectionState, signalingState } = connection;
    console.log({ connectionState, signalingState });

    return from(connection.setRemoteDescription(answer.description)).pipe(
      catchError((error) => (console.log(error), of(null)))
    );
  }
}
