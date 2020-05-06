import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { User } from '@models/index';
import { RoomService } from '../../services/room.service';
import { TitleService } from '@services/title.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { MatDialog } from '@angular/material/dialog';
import { UserListComponent } from '../user-list/user-list.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public user$: Observable<User> = this.room.user$;
  public code$: Observable<string> = this.room.code$;

  constructor(
    private activeRoute: ActivatedRoute,
    private title: TitleService,
    private dialog: MatDialog,
    public room: RoomService
  ) {}

  ngOnDestroy() {
    this.room.ngOnDestroy();
  }

  ngOnInit() {
    this.room.roomId = this.activeRoute.snapshot.paramMap.get('id');
    this.room.ngOnInit();

    this.title.click$.pipe(untilDestroyed(this)).subscribe(() => {
      this.room.onlineUsers$.pipe(first()).subscribe((users) =>
        this.dialog.open(UserListComponent, {
          data: { users },
        })
      );
    });
  }

  sendText(text) {
    this.room.transferText(text);
  }
}
