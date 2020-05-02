import { Injectable } from '@angular/core';

import { UsersApiService } from './users-api.service';
import { RoomApiService } from './room-api.service';
import { RoomUserApiService } from './room-user-api.service';
import { RoomsApiService } from './rooms-api.service';
import { MessagesApiService } from './messages-api.service';
import { IApiService } from '@interfaces/repository/api.service';

@Injectable({ providedIn: 'root' })
export class ApiService implements IApiService {
  constructor(
    public users: UsersApiService,
    public room: RoomApiService,
    public rooms: RoomsApiService,
    public roomUsers: RoomUserApiService,
    public messages: MessagesApiService
  ) {}
}
