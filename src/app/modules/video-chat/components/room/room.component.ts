import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { User } from '@models/index';
import { RoomService } from '../../services/room.service';
import { TitleService } from '@services/title.service';
import { MembersDialogComponent } from '../../dialogs/members-dialog/members-dialog.component';

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
        this.dialog.open(MembersDialogComponent, {
          data: { users },
          width: '300px',
        })
      );
    });
  }

  sendText(text) {
    this.room.transferText(text);
  }
}
