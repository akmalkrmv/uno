import { IUsersApiService } from './users-api.service';
import { IRoomApiService } from './room-api.service';
import { IRoomsApiService } from './rooms-api.service';
import { IRoomUserApiService } from './room-user-api.service';
import { IMessagesApiService } from './messages-api.service';

export interface IApiService {
  users: IUsersApiService;
  room: IRoomApiService;
  rooms: IRoomsApiService;
  roomUsers: IRoomUserApiService;
  messages: IMessagesApiService;
}
