import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '@models/index';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { switchMap } from 'rxjs/operators';

@Component({
  templateUrl: './friends-page.component.html',
  styleUrls: ['./friends-page.component.scss'],
})
export class FriendsPageComponent {
  public firends$: Observable<IUser[]>;

  constructor(private auth: AuthService, private api: ApiService) {
    this.firends$ = this.auth.authorized$.pipe(
      switchMap((user) => this.api.users.getFreinds(user.id))
    );
  }
}
