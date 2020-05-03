import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User, MenuItemEvent } from '@models/index';

@Component({
  selector: 'app-room-toolbar',
  templateUrl: './room-toolbar.component.html',
  styleUrls: ['./room-toolbar.component.scss'],
})
export class RoomToolbarComponent implements OnInit {
  @Input() user: User;
  @Input() title: string;

  @Output() menuItemClicked = new EventEmitter<MenuItemEvent>();

  constructor() {}

  ngOnInit(): void {}
  
  public call() {
    this.menuItemClicked.emit({ type: 'call' });
  }

  public back(): void {
    history.back();
  }
}
