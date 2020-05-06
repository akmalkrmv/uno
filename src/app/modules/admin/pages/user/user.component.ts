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

import { User } from '@models/index';
import { ApiService } from '@services/repository/api.service';

@Component({
  selector: 'app-admin-user-card',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() user: User;
  @Input() isCardView: boolean;
  @Output() save = new EventEmitter<User>();
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
      this.api.users.users$.pipe(untilDestroyed(this)).subscribe((users) => {
        this.user = users.find((user) => user.id == userId);
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  public back() {
    history.back();
  }
}
