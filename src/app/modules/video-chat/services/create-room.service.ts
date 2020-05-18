import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { switchMap, first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CreateRoomService {
  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService
  ) {}

  create(): void {
    this.auth.authorized$
      .pipe(switchMap((user) => this.api.room.createRoom(user)))
      .pipe(first())
      .subscribe((roomId) => {
        this.router.navigate([`/room/${roomId}`]);
      });
  }
}
