import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '@models/index';
import { ApiService } from '@services/repository/api.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  public rooms$: Observable<Room[]>;

  constructor(private api: ApiService) {
    this.rooms$ = api.rooms.rooms$;
  }

  ngOnInit(): void {}
}
