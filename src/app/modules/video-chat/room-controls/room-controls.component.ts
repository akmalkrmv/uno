import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@services/auth.service';
import { ClipboardService } from '@services/clipboard.service';
import { MenuItemEvent } from '@models/index';

@Component({
  selector: 'app-room-controls',
  templateUrl: './room-controls.component.html',
  styleUrls: ['./room-controls.component.scss'],
})
export class RoomControlsComponent implements OnInit {
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
    ClipboardService.copyTextToClipboard(location.href);
    this.snackBar.open(`Cсылка скопирована: ${location.href}`, '', {
      duration: 2000,
    });
  }
}