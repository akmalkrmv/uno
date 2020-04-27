import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CallDialogComponent } from './call-dialog/call-dialog.component';

@NgModule({
  entryComponents: [CallDialogComponent],
  declarations: [CallDialogComponent],
  imports: [SharedModule],
})
export class VideoChatModule {}
