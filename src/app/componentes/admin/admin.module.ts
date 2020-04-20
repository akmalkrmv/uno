import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminComponent } from './admin.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomComponent } from './pages/room/room.component';
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    AdminComponent,
    RoomsComponent,
    RoomComponent,
    UsersComponent,
    UserComponent,
  ],
  imports: [SharedModule, AdminRoutingModule],
})
export class AdminModule {}
