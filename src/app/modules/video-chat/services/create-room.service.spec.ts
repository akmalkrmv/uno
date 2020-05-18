import { TestBed } from '@angular/core/testing';

import { CreateRoomService } from './create-room.service';

describe('CreateRoomService', () => {
  let service: CreateRoomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRoomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
