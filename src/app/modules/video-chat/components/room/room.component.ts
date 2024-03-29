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
  public viewState$: Observable<string> = this.room.viewState$;
  public roomId: string = this.room.roomId;

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
    this.activeRoute.paramMap.pipe(untilDestroyed(this)).subscribe(async (paramsMap) => {
      await this.room.ngOnDestroy();
      this.roomId = this.room.roomId = paramsMap.get('id');
      await this.room.ngOnInit();

      console.log('room', this.roomId)
    });

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
