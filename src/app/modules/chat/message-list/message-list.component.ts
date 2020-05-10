import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Message } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { map, tap, first } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  @Input() roomId: string;
  @Input() userId: string;

  @ViewChild('messages') messagesRef: ElementRef;

  public messages$: Observable<Message[]>;
  public content: string;

  constructor(private api: ApiService) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.messages$ = combineLatest([
      this.api.messages.roomMessages(this.roomId),
      this.api.users.users$,
    ]).pipe(
      map(([messages, users]) =>
        messages.map((message) => ({
          ...message,
          sender: users.find((user) => user.id == message.senderId),
        }))
      ),
      tap(() => this.scrollToBottom())
    );
  }

  public send() {
    if (!this.roomId || !this.userId || !this.content) {
      return;
    }

    this.api.messages.create({
      roomId: this.roomId,
      senderId: this.userId,
      content: this.content,
    });

    this.content = '';
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesRef) {
        const messages = this.messagesRef.nativeElement;
        messages.scrollTo(0, messages.scrollHeight);
      }
    });
  }
}
