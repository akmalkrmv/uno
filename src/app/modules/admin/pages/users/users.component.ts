import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@services/repository/api.service';
import { IUser } from '@models/index';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public users$ = new BehaviorSubject<IUser[]>([]);
  public isCardView$ = new BehaviorSubject(true);

  constructor(private api: ApiService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.api.users
      .getAll()
      .pipe(untilDestroyed(this))
      .subscribe((users) => this.users$.next(users));
  }

  public save(user: IUser) {
    this.api.users.update(user);
  }

  public remove(roomId: string) {
    this.api.users.remove(roomId);
  }

  public toggleCardView() {
    this.isCardView$.next(!this.isCardView$.value);
  }
}
