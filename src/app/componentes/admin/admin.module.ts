import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { MaterialImportsModule } from 'src/app/shared/material-imports.module';
import { ArraySortPipe } from 'src/app/pipes/sort-by.pipe';

import { AdminComponent } from './admin.component';
import { RoomsComponent } from './pages/rooms/rooms.component';
import { RoomComponent } from './pages/room/room.component';
import { UsersComponent } from './pages/users/users.component';
import { UserComponent } from './pages/user/user.component';

@NgModule({
  declarations: [
    ArraySortPipe,
    AdminComponent,
    RoomsComponent,
    RoomComponent,
    UsersComponent,
    UserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialImportsModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
