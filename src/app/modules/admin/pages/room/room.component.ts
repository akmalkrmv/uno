import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { combineLatest } from 'rxjs';

import { Room } from '@models/index';
import { ApiService } from '@services/repository/api.service';

@Component({
  selector: 'app-room-card',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnInit {
  @Input() room: Room;
  @Output() save = new EventEmitter<Room>();
  @Output() remove = new EventEmitter<string>();

  constructor(
    private api: ApiService,
    private activeRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    const roomId = this.activeRoute.snapshot.paramMap.get('id');
    if (roomId) {
      combineLatest([
        this.api.users.users$,
        this.api.roomUsers.maps$,
        this.api.rooms.rooms$,
      ])
        .pipe(untilDestroyed(this))
        .subscribe(([users, maps, rooms]) => {
          const room = rooms.find((room) => room.id == roomId);
          const userIds = maps
            .filter((map) => map.roomId == room.id)
            .map((map) => map.userId);

          this.room = {
            ...room,
            creator: users.find((user) => user.id == room.creator.id) || {},
            users: users.filter((user) => userIds.includes(user.id)),
          };

          this.changeDetectorRef.detectChanges();
        });
    }
  }

  public back() {
    history.back();
  }
}
