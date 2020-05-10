import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { first, switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.scss'],
})
export class FriendsPageComponent implements OnDestroy {
  public users$: Observable<IUser[]>;

  constructor(private auth: AuthService, private api: ApiService) {
    this.users$ = this.auth.user$
      .pipe(first(), untilDestroyed(this))
      .pipe(switchMap((user) => this.api.users.getFreinds(user.id)));
  }

  ngOnDestroy(): void {}
}
