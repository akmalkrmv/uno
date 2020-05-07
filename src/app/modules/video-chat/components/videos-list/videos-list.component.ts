import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
})
export class VideosListComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit(): void {}

  get connectionCount() {
    return this.user && this.user.connections
      ? this.user.connections.length
      : 0;
  }
}
