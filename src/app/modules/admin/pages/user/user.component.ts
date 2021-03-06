import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { IUser } from '@models/index';
import { ApiService } from '@services/repository/api.service';

@Component({
  selector: 'app-admin-user-card',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() user: IUser;
  @Input() isCardView: boolean;
  @Output() save = new EventEmitter<IUser>();
  @Output() remove = new EventEmitter<string>();

  constructor(
    private api: ApiService,
    private activeRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    const userId = this.activeRoute.snapshot.paramMap.get('id');
    if (userId) {
      this.api.users
        .findById(userId)
        .pipe(untilDestroyed(this))
        .subscribe((user) => {
          this.user = user;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  public back() {
    history.back();
  }
}
