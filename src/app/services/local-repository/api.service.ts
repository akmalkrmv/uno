import { Injectable } from '@angular/core';

import { UsersApiService } from './users.service';
import { RoomApiService } from './room-api.service';
import { RoomUserApiService } from './room-user-api.service';
import { RoomsApiService } from './rooms-api.service';
import { MessagesApiService } from './messages-api.service';

@Injectable({ providedIn: 'root' })
export class LocalApiService {
  constructor(
    public users: UsersApiService,
    public room: RoomApiService,
    public rooms: RoomsApiService,
    public roomUsers: RoomUserApiService,
    public messages: MessagesApiService
  ) {}
}
