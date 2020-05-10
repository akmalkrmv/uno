import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';

@Component({
  templateUrl: './create-room-page.component.html',
  styleUrls: ['./create-room-page.component.scss'],
})
export class CreateRoomPageComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnDestroy(): void {}
  
  ngOnInit(): void {
    this.auth.authorized$
      .pipe(switchMap((user) => this.api.rooms.createRoom(user.id)))
      .pipe(first(), untilDestroyed(this))
      .subscribe((roomId) => {
        this.router.navigate([`/room/${roomId}`]);
      });
  }
}
