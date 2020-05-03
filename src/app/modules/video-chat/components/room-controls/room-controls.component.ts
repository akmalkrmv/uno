import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@services/auth.service';
import { copyToClipboard } from '@utils/index';
import { MenuItemEvent } from '@models/index';

@Component({
  selector: 'app-room-controls',
  templateUrl: './room-controls.component.html',
  styleUrls: ['./room-controls.component.scss'],
})
export class RoomControlsComponent implements OnInit {
  @Output() menuItemClicked = new EventEmitter<MenuItemEvent>();

  constructor(private snackBar: MatSnackBar, public auth: AuthService) {}

  public get canShare() {
    return 'share' in navigator;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public call() {
    this.menuItemClicked.emit({ type: 'call' });
  }

  public requestMedia() {
    this.menuItemClicked.emit({ type: 'requestMedia' });
  }

  public hangup() {
    this.menuItemClicked.emit({ type: 'hangup' });
  }

  public leaveRoom() {
    this.menuItemClicked.emit({ type: 'leaveRoom' });
  }

  public retryCall() {
    this.menuItemClicked.emit({ type: 'retryCall' });
  }

  public shareLink() {
    if ('share' in navigator) {
      (navigator as any)
        .share({
          title: 'Uno',
          text: 'Присоединяйтесь к видео звонку: ',
          url: location.href,
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    }
  }

  public copyLink() {
    copyToClipboard(location.href);
    this.snackBar.open(`Cсылка скопирована`, '', {
      duration: 2000,
    });
  }
}
