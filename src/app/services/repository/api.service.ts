import { Injectable } from '@angular/core';

import { UsersApiService } from './users-api.service';
import { RoomApiService } from './room-api.service';
import { RoomsApiService } from './rooms-api.service';
import { OfferApiService } from './offer-api.service';
import { MessagesApiService } from './messages-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    public users: UsersApiService,
    public room: RoomApiService,
    public rooms: RoomsApiService,
    public offer: OfferApiService,
    public messages: MessagesApiService
  ) {}
}
