// import { TestBed } from '@angular/core/testing';
// import { of, Observable } from 'rxjs';
// import { switchMap, tap } from 'rxjs/operators';

// import { PeerService, ICallData } from './peer.service';
// import { IOffer, IUser } from '@models/index';
// import { OfferApiService } from '@services/repository/offer-api.service';
// import { ConnectionLogger } from './connection-logger.service';

// describe('PeerService', () => {
//   let service: PeerService;
//   let offerApi: OfferApiService;
//   let offerApiStub: any;
//   let userOffers: IOffer[];
//   let connections: Record<string, RTCPeerConnection>;
//   let logger: ConnectionLogger;

//   let callFromFriend1: ICallData;
//   let callToFriend1: ICallData;

//   let roomId = 'room';
//   let me: IUser;
//   let friend1: IUser;
//   let friend2: IUser;
//   let friend3: IUser;

//   let originalTimeout: number;

//   beforeEach(() => {
//     userOffers = [];
//     connections = {};

//     offerApiStub = {
//       createOffer: (roomId: string, offer: IOffer) => {
//         return Promise.resolve(userOffers.push(offer));
//       },
//       userOffers: (roomId: string, userId: string) => {
//         return of(
//           userOffers
//             .filter((offer) => offer.receiver === userId)
//             .filter((offer) => offer.type === 'offer')
//         );
//       },
//       userAnswers: (roomId: string, userId: string) => {
//         return of(
//           userOffers
//             .filter((offer) => offer.receiver === userId)
//             .filter((offer) => offer.type === 'answer')
//         );
//       },
//     };

//     TestBed.configureTestingModule({
//       providers: [{ provide: OfferApiService, useValue: offerApiStub }],
//     });

//     service = TestBed.inject(PeerService);
//     offerApi = TestBed.inject(OfferApiService);
//     logger = new ConnectionLogger();

//     originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

//     me = { id: 'current' };
//     friend1 = { id: 'friend1' };
//     friend2 = { id: 'friend2' };
//     friend3 = { id: 'friend3' };

//     callFromFriend1 = service.createCall(roomId, me, friend1);
//     callToFriend1 = service.createCall(roomId, friend1, me);
//   });

//   afterEach(function () {
//     jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should create peer to one remote user', async () => {
//     const peer = service.createPeer(friend1);

//     expect(peer).toBeTruthy();
//     expect(peer).toBeInstanceOf(RTCPeerConnection);
//   });

//   it('should create offer to one remote user', async () => {
//     const offer = await service.call(callFromFriend1);

//     expect(offer).toBeTruthy();
//     expect(offer.type).toEqual('offer');
//     expect(offer.sender).toEqual(me.id);
//     expect(offer.receiver).toEqual(friend1.id);
//   });

//   it('should recieve offer from one friend', async () => {
//     await service.call(callFromFriend1);
//     const offers$: Observable<IOffer[]> = offerApi.userOffers(roomId, me.id);

//     expect(offers$).toBeDefined();

//     offers$.subscribe((offers) => {
//       expect(offers).toBeTruthy();
//       expect(offers.length).toEqual(1);
//       expect(offers[0].sender).toEqual(friend1.id);
//       expect(offers[0].receiver).toEqual(me.id);
//     });
//   });

//   it('should create offer with description', async (done: DoneFn) => {
//     const offerFromFriend = await service.call(callFromFriend1);
//     const offers$: Observable<IOffer[]> = offerApi.userOffers(roomId, me.id);

//     offers$.subscribe((offers) => {
//       const offer = offers[0];
//       expect(offer.description).toBeTruthy();
//       expect(offer.description).toEqual(offerFromFriend.description);

//       done();
//     });
//   });

//   it('should create answer on offer', async (done: DoneFn) => {
//     const offerFromFriend = await service.call(callFromFriend1);
//     await service.sendOffer(roomId, offerFromFriend);

//     offerApi.userOffers(roomId, me.id).subscribe(async (offers) => {
//       const answer = await service.answerToCall(callFromFriend1);

//       expect(answer).toBeTruthy();
//       expect(answer.description).toBeTruthy();

//       done();
//     });
//   });

//   const makeACall = async (callData: ICallData) => {
//     const { caller, receiver } = callData;

//     caller.peer.onicecandidate = (ev) => {
//       console.log('onicecandidate caller');
//       // ev.candidate &&
//       //   receiver.peer.addIceCandidate(new RTCIceCandidate(ev.candidate));
//     };

//     receiver.peer.onicecandidate = (ev) => {
//       console.log('onicecandidate receiver');
//       // ev.candidate &&
//       //   caller.peer.addIceCandidate(new RTCIceCandidate(ev.candidate));
//     };

//     // friend1 calling to me
//     const offer = await service.call(callData);
//     await service.sendOffer(roomId, offer);

//     logger.showState(caller.peer);

//     return offerApi.userOffers(roomId, me.id).pipe(
//       switchMap(async (offers) => {
//         // me answering to friend1
//         const answer = await service.answerToCall(callData);
//         await service.sendOffer(roomId, answer);

//         logger.showState(caller.peer);

//         return offerApi.userAnswers(roomId, friend1.id).pipe(
//           tap(async (answers) => {
//             // friend1 connecting to me
//             await service.connect(caller.peer, answers[0]);

//             logger.showState(caller.peer);
//           })
//         );
//       })
//     );
//   };

//   it('should connect on answer', async (done: DoneFn) => {
//     let isNegotiating1 = false;
//     let isNegotiating2 = false;

//     const peerMe = callToFriend1.caller.peer;
//     const peerFriend1 = callToFriend1.receiver.peer;

//     peerMe.onnegotiationneeded = async () => {
//       console.log('me: onnegotiationneeded', isNegotiating1);

//       if (isNegotiating1) return;

//       isNegotiating1 = true;

//       // (await makeACall(connectionMe, connectionFriend1)).subscribe(() => {
//       //   expect(peerMe.connectionState).toEqual('connecting');
//       //   expect(peerFriend1.connectionState).toEqual('connecting');

//       //   done();
//       // });
//     };

//     peerFriend1.onnegotiationneeded = async () => {
//       console.log('friend1: onnegotiationneeded', isNegotiating2);

//       if (isNegotiating2) return;

//       isNegotiating2 = true;

//       (await makeACall(callToFriend1)).subscribe(() => {
//         isNegotiating2 = false;

//         logger.showState(peerMe);
//         logger.showState(peerFriend1);

//         expect(peerMe.connectionState).toEqual('connecting');
//         expect(peerFriend1.connectionState).toEqual('connecting');

//         setTimeout(() => {
//           expect(peerMe.connectionState).toEqual('connecting');
//           expect(peerFriend1.connectionState).toEqual('connecting');

//           logger.showState(peerMe);
//           logger.showState(peerFriend1);

//           done();
//         }, 2000);
//       });
//     };

//     // Connect with data channels
//     // const channel1 = peerMe.createDataChannel('test');
//     // const channel2 = peerFriend1.createDataChannel('test');

//     // channel1.onmessage = (ev) => console.log(ev.data);
//     // channel2.onopen = () => {
//     //   console.log('channel2.onopen');
//     //   channel2.send('hello from channel');
//     // };

//     // Connect with media
//     // Add audio tracks
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     stream.getTracks().forEach((track) => peerMe.addTrack(track, stream));
//     stream.getTracks().forEach((track) => peerFriend1.addTrack(track, stream));
//   });
// });
