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
    combineLatest([
      this.api.users.users$,
      this.api.roomUsers.maps$,
      this.api.rooms.rooms$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([users, maps, rooms]) => {
        rooms = rooms.map((room) => {
          const userIds = maps
            .filter((map) => map.roomId == room.id)
            .map((map) => map.userId);

          return {
            ...room,
            creator: users.find((user) => user.id == room.creator.id) || {},
            users: users.filter((user) => userIds.includes(user.id)),
          };
        });

        this.rooms$.next(rooms);
        console.log(rooms);
      });
  }

  public save(room: Room) {
    this.api.rooms.update(room);
  }

  public remove(roomId: string) {
    this.api.rooms.remove(roomId);
  }
}
