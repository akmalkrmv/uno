import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Room } from '@models/index';

@Component({
  selector: 'app-room-card',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnInit {
  @Input() room: Room;
  @Output() save = new EventEmitter<Room>();
  @Output() remove = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}
}
