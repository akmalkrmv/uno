import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

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
