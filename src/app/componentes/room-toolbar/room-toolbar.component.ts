import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClipboardService } from 'src/app/services/clipboard.service';
import { MenuItemEvent } from 'src/app/models/menu-item-event';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-room-toolbar',
  templateUrl: './room-toolbar.component.html',
  styleUrls: ['./room-toolbar.component.scss'],
})
export class RoomToolbarComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() roomId: string;

  @Output() menuItemClicked = new EventEmitter<MenuItemEvent>();

  constructor(private snackBar: MatSnackBar) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public call() {
    this.menuItemClicked.emit({ type: 'call' });
  }

  public hangup() {
    this.menuItemClicked.emit({ type: 'hangup' });
  }

  public async leaveRoom() {
    this.menuItemClicked.emit({ type: 'leaveRoom' });
  }

  public retryCall() {
    this.menuItemClicked.emit({ type: 'retryCall' });
  }

  public copyLink() {
    ClipboardService.copyTextToClipboard(location.href);
    this.snackBar.open(`Cсылка скопирована: ${location.href}`, '', {
      duration: 2000,
    });
  }
}
