import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { RoomComponent } from './room/room.component';
import { UserListComponent } from './user-list/user-list.component';
import { RoomToolbarComponent } from './room-toolbar/room-toolbar.component';
import { VideosListComponent } from './videos-list/videos-list.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { CallDialogComponent } from './call-dialog/call-dialog.component';

@NgModule({
  entryComponents: [CallDialogComponent],
  declarations: [
    RoomComponent,
    UserListComponent,
    RoomToolbarComponent,
    VideosListComponent,
    VideoControlsComponent,
    CallDialogComponent,
  ],
  imports: [SharedModule],
})
export class VideoChatModule {}
