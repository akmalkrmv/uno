import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-room-item',
  templateUrl: './room-item.component.html',
  styleUrls: ['./room-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomItemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
