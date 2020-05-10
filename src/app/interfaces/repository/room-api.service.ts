import { Observable } from 'rxjs';
import { Offer, Answer, IOffer, IceCandidate } from '@models/room';

type offerType = 'offers' | 'answers';

export interface IRoomApiService {
  users$: Observable<any[]>;
  offers$: Observable<Offer[]>;
  answers$: Observable<Answer[]>;
  iceCandidates$: Observable<IceCandidate[]>;

  init(roomId: string): void;

  exists(roomId: string): Observable<boolean>;
  joinRoom(userId: string): Observable<any>;
  otherUsers(userId: string): Observable<any[]>;

  userOffers(userId: string): Observable<Offer[]>;
  userAnswers(userId: string): Observable<Answer[]>;
  createOffer(offer: Offer): Observable<string>;
  createAnswer(answer: Answer): Observable<string>;

  addIceCandidate(payload: IceCandidate): Observable<string>;
  userIceCandidates(userId: string): Observable<IceCandidate[]>;

  clearConnections(): Observable<any>;

  findByUsers(
    userFrom: string,
    userTo: string,
    offerType: offerType
  ): Observable<IOffer>;
}
