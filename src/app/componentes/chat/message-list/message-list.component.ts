import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  HostBinding,
} from '@angular/core';
import { Message } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { take, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  @Input() roomId: string;
  @Input() userId: string;

  public messages$: Observable<Message[]>;
  public content: string;

  constructor(private api: ApiService) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.messages$ = combineLatest([
      this.api.messages.messages$,
      this.api.users.users$,
    ]).pipe(
      map(([messages, users]) =>
        messages
          .filter((message) => message.roomId == this.roomId)
          .map((message) => {
            return {
              ...message,
              sender: users.find((user) => user.id == message.senderId),
            };
          })
      )
    );
  }

  public send() {
    if (!this.roomId || !this.userId || !this.content) {
      return;
    }

    this.api.messages
      .create({
        roomId: this.roomId,
        senderId: this.userId,
        content: this.content,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.content = '';
      });
    1;
  }

  public keyDown(event: KeyboardEvent): void {
    if (event.keyCode === 13 && event.shiftKey) {
      // On 'Shift+Enter' do this...
      this.send();
    }
  }
}
