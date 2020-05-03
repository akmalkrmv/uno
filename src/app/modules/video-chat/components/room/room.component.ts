import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '@models/index';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public user$: Observable<User> = this.room.user$;

  constructor(private activeRoute: ActivatedRoute, private room: RoomService) {}

  ngOnDestroy() {
    this.room.ngOnDestroy();
  }

  ngOnInit() {
    this.room.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.room.ngOnInit();
  }
}
