import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {}
  ngOnDestroy() {}

  public createRoom() {
    this.api.users
      .authorize()
      .pipe(
        take(1),
        untilDestroyed(this),
        switchMap((user) => this.api.rooms.createRoom(user.id))
      )
      .subscribe((roomId) => {
        this.router.navigate([`/room/${roomId}`]);
      });
  }

  public joinRoom() {
    this.router.navigate([`/room/${this.roomId}`]);
  }

  public googleSignIn() {
    this.auth.googleSignIn().pipe(take(1), untilDestroyed(this)).subscribe();
  }
  public facebookSignIn() {
    this.auth.facebookSignIn().pipe(take(1), untilDestroyed(this)).subscribe();
  }
  public githubSignIn() {
    this.auth.githubSignIn().pipe(take(1), untilDestroyed(this)).subscribe();
  }
}
