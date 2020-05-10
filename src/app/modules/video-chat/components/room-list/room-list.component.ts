import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent implements OnInit {
  public rooms$: Observable<Room[]>;

  constructor(private api: ApiService, private auth: AuthService) {
    this.rooms$ = auth.authorized$.pipe(
      switchMap((user) => api.roomV2.userRooms(user.id))
    );
  }

  ngOnInit(): void {}
}
