import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, BehaviorSubject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiService } from '@services/repository/api.service';
import { Room } from '@models/index';

@Component({
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
})
export class RoomsComponent implements OnInit, OnDestroy {
  public rooms$ = new BehaviorSubject<Room[]>([]);

  constructor(private api: ApiService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.api.rooms.rooms$.pipe(untilDestroyed(this)).subscribe((rooms) => {
      rooms = rooms.map((room) => {
        return {
          ...room,
          creator: room.users.find((user) => user.id == room.creator.id) || {},
        };
      });

      this.rooms$.next(rooms);
    });
  }

  public save(room: Room) {
    this.api.room.update(room);
  }

  public remove(roomId: string) {
    this.api.room.remove(roomId);
  }
}
