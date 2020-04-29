import { Injectable } from '@angular/core';
import { take, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { RoomService } from '@services/repository/room.service';
import { Connection, IceCandidate, User } from '@models/index';

@Injectable({ providedIn: 'root' })
export class IceCandidateService {
  constructor(private roomService: RoomService) {}

  public sendIceCandidatesIfCompleted(
    connection: Connection,
    senderId: string,
    recieverId: string
  ) {
    if (!connection) return;
    if (!connection.remote) return;
    if (connection.remote.iceGatheringState !== 'complete') return;

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
    this.roomService
      .addIceCandidate({ senderId, recieverId, candidates })
      .pipe(take(1), catchError(this.handleError))
      .subscribe();
  }

  public addIceCandidatesIfExists(user: User) {
    return this.roomService
      .userIceCandidates(user.id)
      .pipe(take(1))
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
      const connectionRef = user.getConnection(ice.recieverId);
      connectionRef.addIceCandidatesToQueue(ice.candidates);
    });
  }

  private handleError(error) {
    console.log(error);
    return of(null);
  }
}
