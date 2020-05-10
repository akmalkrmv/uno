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
    combineLatest([this.api.users.users$, this.api.rooms.rooms$])
      .pipe(untilDestroyed(this))
      .subscribe(([users, rooms]) => {
        rooms = rooms.map((room) => {
          return {
            ...room,
            creator: users.find((user) => user.id == room.creator.id) || {},
            users: users.filter((user) => room.users.includes(user.id)),
          };
        });

        this.rooms$.next(rooms);
      });
  }

  public save(room: Room) {
    this.api.roomV2.update(room);
  }

  public remove(roomId: string) {
    this.api.roomV2.remove(roomId);
  }
}
