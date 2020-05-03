import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallDialogComponent } from './call-dialog/call-dialog.component';
import { RoomComponent } from './room/room.component';
import { RoomControlsComponent } from './room-controls/room-controls.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomToolbarComponent } from './room-toolbar/room-toolbar.component';
import { SelfVideoComponent } from './self-video/self-video.component';
import { UserListComponent } from './user-list/user-list.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { VideoItemComponent } from './video-item/video-item.component';
import { VideosListComponent } from './videos-list/videos-list.component';

const routes: Routes = [{ path: '', component: RoomListComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class VideoChatRoutingModule {}
