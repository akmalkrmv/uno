import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, catchError, take, tap } from 'rxjs/operators';

import { offerOptions } from '@constants/index';
import { User, Offer, Answer, Connection } from '@models/index';
import { RoomService } from '@services/repository/room.service';
import { CallDialogComponent } from '../componentes/video-chat/call-dialog/call-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({ providedIn: 'root' })
export class OfferService {
  public user: User;

  constructor(private roomService: RoomService, private dialog: MatDialog) {}

  public init(user: User) {
    this.user = user;
  }

  public offerAll(callerId: string, users: User[]) {
    for (const user of users) {
      this.offer(callerId, user.id, user.name);
    }
  }

  public answerAll(offers: Offer[], users: User[]) {
    for (const offer of offers) {
      const user = users.find((user) => user.id == offer.from);
      const caller = user ? user.name : offer.from;
      this.answer(offer, caller);
    }
  }

  public setRemoteAll(answers: Answer[], users: User[]) {
    for (const answer of answers) {
      const user = users.find((user) => user.id == answer.from);
      const caller = user ? user.name : answer.from;
      this.setRemote(answer, caller);
      // this.offer(this.user.id, user.id, caller);
    }
  }

  public offer(callerId: string, recieverId: string, callerName: string) {
    return this.createOfferToUser(callerId, recieverId, callerName).subscribe();
  }

  public answer(offer: Offer, caller: string, dialog = false) {
    if (!dialog) {
      return this.answerToOffer(offer, caller).subscribe();
    }

    this.dialog
      .open(CallDialogComponent, { data: { from: caller } })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.answerToOffer(offer, caller).subscribe();
        }
      });
  }

  public setRemote(offer: Offer, caller: string, dialog = false) {
    if (!dialog) {
      return this.handleAnswer(offer, caller).subscribe();
    }

    this.dialog
      .open(CallDialogComponent, { data: { from: caller } })
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.handleAnswer(offer, caller).subscribe();
        }
      });
  }

  private createOfferToUser(
    fromId: string,
    toId: string,
    userName?: string
  ): Observable<string> {
    const connectionRef = this.user.getConnection(toId, userName);
    const connection = connectionRef.remote;
    connectionRef.showState();

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = (event) =>
      this.sendIceCandidates(connectionRef, fromId, toId);

    // if (connectionRef.isConnected) {
    //   return of(null);
    // }

    const action = async () => {
      const offer = await connection.createOffer(offerOptions);
      await connection.setLocalDescription(offer);
      return connection.localDescription.toJSON();
    };

    return from(action()).pipe(
      switchMap((description) =>
        this.roomService.createOffer({ from: fromId, to: toId, description })
      ),
      take(1),
      catchError((error) => (console.log(error), of(null)))
    );
  }

  private answerToOffer(offer: Offer, userName?: string): Observable<string> {
    const connectionRef = this.user.getConnection(offer.from, userName);
    const connection = connectionRef.remote;
    connectionRef.showState();

    this.user.addTracks(connection);

    connection.onicegatheringstatechange = (event) =>
      this.sendIceCandidates(connectionRef, offer.from, offer.to);

    // if (connectionRef.isConnected) {
    //   return of(null);
    // }

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
      take(1),
      catchError((error) => (console.log(error), of(null)))
    );
  }

  private handleAnswer(answer: Answer, userName?: string): Observable<void> {
    const connectionRef = this.user.getConnection(answer.from, userName);
    const connection = connectionRef.remote;
    connectionRef.showState();

    // if (connectionRef.isConnected) {
    //   return of(null);
    // }

    return from(connection.setRemoteDescription(answer.description)).pipe(
      take(1),
      catchError((error) => (console.log(error), of(null)))
    );
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
    this.roomService.addIceCandidate(payload);
  }
}
