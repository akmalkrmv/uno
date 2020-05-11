import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

import { RoomComponent } from './modules/video-chat/components/room/room.component';
import { PlayComponent } from './modules/bura/components/play/play.component';
import { SigninComponent } from './modules/auth/signin/signin.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { NameComponent } from './modules/auth/name/name.component';
import { RoomListComponent } from './modules/video-chat/components/room-list/room-list.component';
import { FriendsPageComponent } from './modules/video-chat/pages/friends-page/friends-page.component';
import { CreateRoomPageComponent } from './modules/video-chat/pages/create-room-page/create-room-page.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'friends', component: FriendsPageComponent },
      { path: 'rooms', component: RoomListComponent },
      { path: 'room/create', component: CreateRoomPageComponent },
      { path: 'room/:id', component: RoomComponent },
      { path: 'game/:id', component: PlayComponent },
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
    ],
  },
  { path: 'login', component: SigninComponent },
  { path: 'name', component: NameComponent },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
