import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent implements OnInit, OnDestroy {
  constructor(private auth: AuthService) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.auth.startUi('#firebaseui-auth-container');
  }
}
