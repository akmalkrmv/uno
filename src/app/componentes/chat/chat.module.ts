import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialImportsModule } from 'src/app/shared/material-imports.module';

import { MessageComponent } from './message/message.component';
import { MessageListComponent } from './message-list/message-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, MaterialImportsModule],
  exports: [MessageComponent, MessageListComponent],
  declarations: [MessageComponent, MessageListComponent],
})
export class ChatModule {}
