import { Component, OnInit } from '@angular/core';
import { CreateRoomService } from '../../services/create-room.service';

@Component({
  templateUrl: './create-room-page.component.html',
  styleUrls: ['./create-room-page.component.scss'],
})
export class CreateRoomPageComponent implements OnInit {
  constructor(public room: CreateRoomService) {}

  ngOnInit(): void {
    this.room.create();
  }
}
