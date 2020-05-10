import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUser } from '@models/index';
import { PresenceService } from '@services/presence.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Input() user: IUser;

  status$: Observable<string>;

  constructor(private precense: PresenceService) {}

  ngOnInit(): void {
    this.status$ = this.precense
      .getPresence(this.user.id)
      .pipe(map((presence) => (presence ? presence.status : 'offline')));
  }
}
