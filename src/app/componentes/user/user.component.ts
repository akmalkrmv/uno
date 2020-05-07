import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { User } from '@models/index';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Input() user: User;

  status$: Observable<string>;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.status$ = this.auth
      .getPresence(this.user.id)
      .pipe(map((presence) => (presence ? presence.status : 'offline')));
  }
}
