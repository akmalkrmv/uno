import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { copyToClipboard } from '@utils/index';
import { User, MenuItemEvent } from '@models/index';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-room-toolbar',
  templateUrl: './room-toolbar.component.html',
  styleUrls: ['./room-toolbar.component.scss'],
})
export class RoomToolbarComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() roomId: string;
  @Input() title: string;

  @Output() menuItemClicked = new EventEmitter<MenuItemEvent>();

  constructor(private snackBar: MatSnackBar, public auth: AuthService) {}

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
    copyToClipboard(location.href);
    this.snackBar.open(`Cсылка скопирована: ${location.href}`, '', {
      duration: 2000,
    });
  }
}
