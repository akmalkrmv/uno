import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(private router: Router) {}

  ngOnInit() {}
  ngOnDestroy() {}

  public createRoom() {
    this.router.navigate([`/rooms/room/create`]);
  }

  public joinRoom() {
    this.router.navigate([`/rooms/room/${this.roomId}`]);
  }
}
