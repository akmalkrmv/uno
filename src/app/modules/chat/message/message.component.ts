import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Message, IUser } from '@models/index';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  @Input() message: Message;
  @Input() user: IUser;
}
