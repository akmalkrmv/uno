import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CallDialogComponent } from './call-dialog/call-dialog.component';
import { RoomComponent } from './room/room.component';
import { RoomControlsComponent } from './room-controls/room-controls.component';
import { RoomToolbarComponent } from './room-toolbar/room-toolbar.component';
import { SelfVideoComponent } from './self-video/self-video.component';
import { UserListComponent } from './user-list/user-list.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { VideoItemComponent } from './video-item/video-item.component';
import { VideosListComponent } from './videos-list/videos-list.component';

@NgModule({
  entryComponents: [CallDialogComponent],
  declarations: [
    CallDialogComponent,
    RoomComponent,
    RoomControlsComponent,
    RoomToolbarComponent,
    SelfVideoComponent,
    UserListComponent,
    VideoControlsComponent,
    VideoItemComponent,
    VideosListComponent,
  ],
  imports: [SharedModule],
})
export class VideoChatModule {}
