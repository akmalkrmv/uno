import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { RoomCollectionService } from "src/app/services/room-collection.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  public roomId: string;

  constructor(
    private router: Router,
    private roomService: RoomCollectionService
  ) {}

  ngOnInit(): void {}

  public async createRoom() {
    const roomId = await this.roomService.createRoom();
    this.router.navigate([`/room/${roomId}`]);
  }

  public async joinRoom() {
    localStorage.removeItem("uno-client-id");
    this.router.navigate([`/room/${this.roomId}`]);
  }
}
