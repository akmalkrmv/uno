import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { IUser } from '@models/index';
import { AuthService } from '@services/auth.service';
import { CreateRoomService } from 'src/app/modules/video-chat/services/create-room.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
  @Input() user: IUser;
  @Output() close = new EventEmitter();

  constructor(private auth: AuthService, private room: CreateRoomService) {}

  ngOnInit(): void {}

  signOut() {
    this.auth.signOut();
  }

  closeSidenav() {
    this.close.emit();
  }

  createRoom() {
    this.room.create();
    this.closeSidenav();
  }
}
