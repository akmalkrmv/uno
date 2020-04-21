import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnDestroy(): void {}
  ngOnInit(): void {}

  public googleSignIn() {
    this.auth
      .googleSignIn()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.redirect());
  }
  public facebookSignIn() {
    this.auth
      .facebookSignIn()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.redirect());
  }
  public githubSignIn() {
    this.auth
      .githubSignIn()
      .pipe(take(1), untilDestroyed(this))
      .subscribe(() => this.redirect());
  }

  public redirect() {
    this.router.navigate(['/']);
  }
}
