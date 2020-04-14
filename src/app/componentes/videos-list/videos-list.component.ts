import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-videos-list',
  templateUrl: './videos-list.component.html',
  styleUrls: ['./videos-list.component.scss'],
})
export class VideosListComponent implements OnInit {
  @Input() user: User;

  public list = ['mock'];

  constructor() {}

  ngOnInit(): void {}

  public increment() {
    this.list.push('mock');
  }

  public decrement() {
    if (this.list.length > 1) {
      this.list.pop();
    }
  }

}
