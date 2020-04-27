import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomComponent } from './pages/room/room.component';
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/user/user.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'rooms', component: RoomsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'rooms/:id', component: RoomComponent },
      { path: 'users/:id', component: UserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
