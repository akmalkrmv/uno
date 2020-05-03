import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CallDialogComponent } from './components/call-dialog/call-dialog.component';
import { RoomComponent } from './components/room/room.component';
import { RoomListComponent } from './components/room-list/room-list.component';
import { SelfVideoComponent } from './components/self-video/self-video.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { VideoControlsComponent } from './components/video-controls/video-controls.component';
import { VideoItemComponent } from './components/video-item/video-item.component';
import { VideosListComponent } from './components/videos-list/videos-list.component';

@NgModule({
  entryComponents: [CallDialogComponent],
  declarations: [
    CallDialogComponent,
    RoomComponent,
    RoomListComponent,
    SelfVideoComponent,
    UserListComponent,
    VideoControlsComponent,
    VideoItemComponent,
    VideosListComponent,
  ],
  imports: [SharedModule],
})
export class VideoChatModule {}
