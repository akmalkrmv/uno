import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { User } from '@models/index';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent implements OnInit {
  @Input() user: User;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}

  signOut() {
    this.auth.signOut();
  }
}
