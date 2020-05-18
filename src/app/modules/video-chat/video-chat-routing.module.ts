import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResolver } from 'src/app/resolvers/user.resolver';
import { RoomResolver } from 'src/app/resolvers/room.resolver';

import { MessageListComponent } from '../chat/message-list/message-list.component';
import { PlayComponent } from '../bura/components/play/play.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { CreateRoomPageComponent } from './pages/create-room-page/create-room-page.component';
import { RoomComponent } from './components/room/room.component';

const routes: Routes = [
  { path: '', redirectTo: 'rooms', pathMatch: 'full' },
  { path: 'rooms', component: RoomListComponent },
  { path: 'room/create', component: CreateRoomPageComponent },
  {
    path: 'room/:id',
    component: RoomComponent,
    children: [
      { path: '', redirectTo: 'messages', pathMatch: 'full' },
      {
        path: 'messages',
        component: MessageListComponent,
        resolve: { user: UserResolver, roomId: RoomResolver },
      },
      {
        path: 'game/:type',
        component: PlayComponent,
        resolve: { user: UserResolver, roomId: RoomResolver },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoChatRoutingModule {}
