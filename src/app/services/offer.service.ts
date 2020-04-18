import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

import { RoomService } from './repository/room.service';
import { Offer, Answer } from '../models/room';
import { User } from '../models/user';

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

    if (
      connection.connectionState === 'connected' ||
      connection.connectionState === 'connecting'
    ) {
      return of(null);
    }

    return from(connection.createOffer()).pipe(
      switchMap((offer) => from(connection.setLocalDescription(offer))),
      switchMap(() =>
        this.roomService.createOffer({
          from: fromId,
          to: toId,
          description: connection.localDescription.toJSON(),
        })
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

    if (
      connection.connectionState === 'connected' ||
      connection.connectionState === 'connecting'
    ) {
      return of(null);
    }

    return from(connection.setRemoteDescription(offer.description)).pipe(
      tap(() => console.log('setRemoteDescription')),
      switchMap(() => from(connection.createAnswer())),
      switchMap((answer) => from(connection.setLocalDescription(answer))),
      switchMap(() => {
        console.log('answering...');
        return this.roomService.createAnswer({
          to: offer.from,
          from: this.user.id,
          description: connection.localDescription.toJSON(),
        });
      }),
      catchError((error) => (console.log(error), of(null)))
    );
  }

  public handleAnswer(answer: Answer, userName?: string): Observable<void> {
    const connectionRef = this.user.getConnection(answer.from);
    const connection = connectionRef.remote;

    if (userName) {
      connectionRef.userName = userName;
    }

    if (
      connection.connectionState === 'connected' ||
      connection.connectionState === 'connecting'
    ) {
      return of(null);
    }

    return from(connection.setRemoteDescription(answer.description)).pipe(
      catchError((error) => (console.log(error), of(null)))
    );
  }
}
