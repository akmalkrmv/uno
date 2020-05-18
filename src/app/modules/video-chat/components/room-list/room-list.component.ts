import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { switchMap, map } from 'rxjs/operators';
import { CreateRoomService } from '../../services/create-room.service';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  public rooms$: Observable<Room[]>;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private createRoom: CreateRoomService
  ) {}

  ngOnInit(): void {
    this.rooms$ = this.auth.authorized$.pipe(
      switchMap((user) => this.api.room.userRooms(user.id)),
      map((rooms) =>
        rooms.map((room) => ({
          ...room,
          name: room.name || room.users.map((user) => user.name).join(', '),
        }))
      )
    );
  }

  create() {
    this.createRoom.create();
  }
}
