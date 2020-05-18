import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedComponentsModule } from 'src/app/componentes/shared-components.module';

import { CallDialogComponent } from './components/call-dialog/call-dialog.component';
import { RoomComponent } from './components/room/room.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { SelfVideoComponent } from './components/self-video/self-video.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VideoControlsComponent } from './components/video-controls/video-controls.component';
import { VideoItemComponent } from './components/video-item/video-item.component';
import { VideosListComponent } from './components/videos-list/videos-list.component';
import { MembersDialogComponent } from './dialogs/members-dialog/members-dialog.component';
import { CreateRoomDialogComponent } from './dialogs/create-room-dialog/create-room-dialog.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { RoomsPageComponent } from './pages/rooms-page/rooms-page.component';
import { ChatModule } from '../chat/chat.module';
import { CreateRoomPageComponent } from './pages/create-room-page/create-room-page.component';
import { VideoChatRoutingModule } from './video-chat-routing.module';
import { RoomItemComponent } from './components/room-item/room-item.component';
import { BuraModule } from '../bura/bura.module';

const dialogs = [
  CallDialogComponent,
  UserListComponent,
  MembersDialogComponent,
  CreateRoomDialogComponent,
];

@NgModule({
  entryComponents: [...dialogs],
  declarations: [
    ...dialogs,
    RoomComponent,
    RoomListComponent,
    SelfVideoComponent,
    VideoControlsComponent,
    VideoItemComponent,
    VideosListComponent,
    FriendsPageComponent,
    RoomsPageComponent,
    CreateRoomPageComponent,
    RoomItemComponent,
  ],
  imports: [
    SharedModule,
    SharedComponentsModule,
    ChatModule,
    BuraModule,
    VideoChatRoutingModule,
  ],
})
export class VideoChatModule {}
