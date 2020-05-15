import { TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { IOffer, IUser } from '@models/index';
import {
  IConnectionService,
  ConnectionService,
  SignallingService,
} from './intrafaces';

describe('PeerService', () => {
  const roomId = 'room';
  const me: IUser = { id: 'current' };
  const friend1: IUser = { id: 'friend1' };
  const friend2: IUser = { id: 'friend2' };
  const friend3: IUser = { id: 'friend3' };

  let originalTimeout: number;
  let service: IConnectionService;

  beforeEach(() => {
    service = new ConnectionService(new SignallingService());
  });

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should connect one user with media', async (done: DoneFn) => {
    const peer = service.createConnection(me.id, friend1.id);

    expect(peer).toBeTruthy();

    service.onConnect = (connectionState) => {
      expect(connectionState).toEqual('connected');
      done();
    };

    // Add audio tracks
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    service.addTracks(me.id, stream);
  });
});
