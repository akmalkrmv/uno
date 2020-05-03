import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '@models/index';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public user: User;

  constructor(private room: RoomService) {}

  ngOnDestroy() {
    this.room.ngOnDestroy();
  }

  ngOnInit() {
    this.room.ngOnInit();
  }
}
