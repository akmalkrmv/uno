import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';

@NgModule({
  imports: [SharedModule],
  exports: [MessageComponent, MessageListComponent],
  declarations: [MessageComponent, MessageListComponent],
})
export class ChatModule {}
