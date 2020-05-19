import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageListComponent } from './message-list/message-list.component';
import { RoomResolver } from 'src/app/resolvers/room.resolver';

const routes: Routes = [
  {
    path: '',
    component: MessageListComponent,
    resolve: { roomId: RoomResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
