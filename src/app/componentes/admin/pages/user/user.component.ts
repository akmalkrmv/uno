import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { User } from '@models/index';

@Component({
  selector: 'app-user-card',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  @Input() user: User;
  @Output() save = new EventEmitter<User>();
  @Output() remove = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
