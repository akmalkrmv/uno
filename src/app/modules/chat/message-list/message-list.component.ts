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
import { tap, first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit, OnDestroy {
  @Input() roomId: string;
  @ViewChild('messages') messagesRef: ElementRef;

  public messages$: Observable<Message[]>;
  public content: string;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnDestroy() {}

  ngOnInit(): void {
    this.messages$ = this.api.messages
      .roomMessages(this.roomId)
      // Scroll to last message always
      .pipe(tap(() => this.scrollToBottom()));

    // Scroll to last message only once
    // this.messages$
    //   .pipe(first(), untilDestroyed(this))
    //   .subscribe(() => this.scrollToBottom());
  }

  public send() {
    if (!this.roomId || !this.content) {
      return;
    }

    this.auth.authorizedInfo$.subscribe((user) => {
      this.api.messages
        .create({
          roomId: this.roomId,
          content: this.content,
          sender: user,
          senderId: user.id,
          type: 'message',
        })
        .then(() => this.scrollToBottom());
    });

    this.content = '';
  }

  public scrollToBottom() {
    setTimeout(() => {
      if (this.messagesRef) {
        const messages = this.messagesRef.nativeElement;
        messages.scrollTo(0, messages.scrollHeight);
      }
    });
  }
}
