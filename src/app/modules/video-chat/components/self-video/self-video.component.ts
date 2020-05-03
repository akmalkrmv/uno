import { Component, OnInit, Input } from '@angular/core';
import { User } from '@models/index';

@Component({
  selector: 'app-self-video',
  templateUrl: './self-video.component.html',
  styleUrls: ['./self-video.component.scss'],
})
export class SelfVideoComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit(): void {}
}
