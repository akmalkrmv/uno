import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserResolver } from 'src/app/resolvers/user.resolver';
import { RoomResolver } from 'src/app/resolvers/room.resolver';

import { MessageListComponent } from '../chat/message-list/message-list.component';
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
        loadChildren: () =>
          import('../chat/chat.module').then((m) => m.ChatModule),
      },
      {
        path: 'game',
        loadChildren: () =>
          import('../bura/bura.module').then((m) => m.BuraModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoChatRoutingModule {}
