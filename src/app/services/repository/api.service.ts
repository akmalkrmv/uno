import { Injectable } from '@angular/core';

import { UsersService } from './users.service';
import { RoomService } from './room.service';
import { RoomUserService } from './room-user.service';
import { RoomCollectionService } from './room-collection.service';
import { MessagesApiService } from './messages-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    public users: UsersService,
    public rooms: RoomCollectionService,
    public roomUsers: RoomUserService,
    public room: RoomService,
    public messages: MessagesApiService
  ) {}
}
