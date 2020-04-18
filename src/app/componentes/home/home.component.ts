import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@services/repository/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {}
  ngOnDestroy() {}

  public createRoom() {
    this.api.users
      .authorize()
      .pipe(untilDestroyed(this))
      .pipe(switchMap((user) => this.api.rooms.createRoom(user.id)))
      .subscribe((roomId) => {
        this.router.navigate([`/room/${roomId}`]);
      });
  }

  public joinRoom() {
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
