import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { RoomCollectionService } from 'src/app/services/room-collection.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(
    private router: Router,
    private roomService: RoomCollectionService,
    private usersService: UsersService
  ) {}

  ngOnInit() {}
  ngOnDestroy() {}

  public createRoom() {
    this.usersService
      .authorize()
      .pipe(untilDestroyed(this))
      .pipe(switchMap((user) => this.roomService.createRoom(user.id)))
      .subscribe((roomId) => {
        this.router.navigate([`/room/${roomId}`]);
      });
  }

  public joinRoom() {
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
