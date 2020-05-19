import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  imports: [SharedModule, ChatRoutingModule],
  exports: [MessageComponent, MessageListComponent],
  declarations: [MessageComponent, MessageListComponent],
})
export class ChatModule {}
