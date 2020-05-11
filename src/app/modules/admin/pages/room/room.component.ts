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
      this.api.rooms.rooms$.pipe(untilDestroyed(this)).subscribe((rooms) => {
        const room = rooms.find((room) => room.id == roomId);
        this.room = {
          ...room,
          creator: room.users.find((user) => user.id == room.creator.id) || {},
        };

        this.changeDetectorRef.detectChanges();
      });
    }
  }

  public back() {
    history.back();
  }
}
