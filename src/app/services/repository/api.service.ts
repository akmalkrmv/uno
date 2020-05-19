import { Injectable } from '@angular/core';

import { UsersApiService } from './users-api.service';
import { RoomApiService } from './room-api.service';
import { RoomsApiService } from './rooms-api.service';
import { OfferApiService } from './offer-api.service';
import { MessagesApiService } from './messages-api.service';
import { GameApiService } from './game-api.service';
import { PodcastApiService } from './podcast-api.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    public users: UsersApiService,
    public room: RoomApiService,
    public rooms: RoomsApiService,
    public offer: OfferApiService,
    public game: GameApiService,
    public podcast: PodcastApiService,
    public messages: MessagesApiService
  ) {}
}
