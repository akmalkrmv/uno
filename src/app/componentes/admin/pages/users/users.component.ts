import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@services/repository/api.service';
import { User } from '@models/index';

@Component({
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  public users$ = new BehaviorSubject<User[]>([]);

  constructor(private api: ApiService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    combineLatest([
      this.api.users.users$,
      // this.api.roomUsers.maps$,
      // this.api.rooms.rooms$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([users]) => {
        this.users$.next(users);
      });
  }
  
  public save(user: User) {
    this.api.users.update(user);
  }

  public remove(roomId: string) {
    this.api.users.remove(roomId);
  }
}