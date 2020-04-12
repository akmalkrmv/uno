import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RoomCollectionService } from 'src/app/services/room-collection.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(
    private router: Router,
    private roomService: RoomCollectionService,
    private usersService: UsersService
  ) {}

  ngOnInit() {}

  public async createRoom() {
    const userId = await this.usersService.authorize();
    const roomId = await this.roomService.createRoom(userId);
    this.router.navigate([`/room/${roomId}`]);
  }

  public async joinRoom() {
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
