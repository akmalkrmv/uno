import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { Connection, IceCandidate, User } from '@models/index';
import { ApiService } from '@services/repository/api.service';

@Injectable({ providedIn: 'root' })
export class IceCandidateService {
  public roomId: string;
  private iceSendingId: any; // NodeJS.Timeout

  constructor(private api: ApiService) {}

  public sendIceCandidatesByGatheringState(
    connectionRef: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!senderId) return;
    if (!recieverId) return;
    if (!connectionRef) return;
    if (!connectionRef.peer) return;

    this.iceSendingId && clearInterval(this.iceSendingId);

    const connection = connectionRef.peer;

    if (connection.iceGatheringState === 'complete') {
      this.sendIceCandidates(connectionRef, senderId, recieverId);
    }

    if (connection.iceGatheringState === 'gathering') {
      this.iceSendingId = setInterval(() => {
        this.sendIceCandidates(connectionRef, senderId, recieverId);
      }, 1000);
    }
  }

  public sendIceCandidatesIfCompleted(
    connection: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!senderId) return;
    if (!recieverId) return;
    if (!connection) return;
    if (!connection.peer) return;
    if (connection.peer.iceGatheringState !== 'complete') return;

    this.sendIceCandidates(connection, senderId, recieverId);
  }

  public sendIceCandidates(
    connection: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!senderId) return;
    if (!recieverId) return;
    if (!connection) return;
    if (!connection.iceCandidates) return;
    if (!connection.iceCandidates.length) return;

    const candidates = [];

    while (connection.iceCandidates.length) {
      const candidate = connection.iceCandidates.pop();
      candidates.push(candidate.toJSON());
    }

    console.log('sending IceCandidates');
    this.api.offer
      .addIceCandidate(this.roomId, {
        sender: senderId,
        reciever: recieverId,
        candidates,
      })
      .catch(this.handleError);
  }

  public addIceCandidatesIfExists(user: User) {
    return this.api.offer
      .userIceCandidates(this.roomId, user.id)
      .pipe(first())
      .pipe(
        tap((iceCandidates) => {
          if (iceCandidates && iceCandidates.length) {
            this.addIceCandidates(user, iceCandidates);
          }
        })
      );
  }

  public addIceCandidates(user: User, iceCandidates: IceCandidate[]) {
    console.log('Got ice candidates', iceCandidates);

    iceCandidates.map((ice) => {
      const connectionRef = user.getConnection(ice.sender);
      connectionRef.addIceCandidatesToQueue(ice.candidates);
    });
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
