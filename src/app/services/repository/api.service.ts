import { Injectable } from '@angular/core';

import { UsersApiService } from './users-api.service';
import { RoomApiService } from './room-api.service';
import { RoomsApiService } from './rooms-api.service';
import { MessagesApiService } from './messages-api.service';

// V2
import { RoomV2ApiService } from './v2/room-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    public users: UsersApiService,
    public room: RoomApiService,
    public rooms: RoomsApiService,
    public messages: MessagesApiService,
    // V2
    public roomV2: RoomV2ApiService
  ) {}
}
