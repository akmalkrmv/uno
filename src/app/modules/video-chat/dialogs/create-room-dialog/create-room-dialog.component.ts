import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { ApiService } from '@services/repository/api.service';
import { AuthService } from '@services/auth.service';
import { Room } from '@models/index';
import { UploadService, Upload } from '@services/upload.service';

@Component({
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
})
export class CreateRoomDialogComponent implements OnInit, OnDestroy {
  public name = new FormControl('', [Validators.required]);
  private photoUrl: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private fileUpload: UploadService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  public create() {
    const data: Partial<Room> = { name: this.name.value };

    if (this.photoUrl) {
      data.photoUrl = this.photoUrl;
    }

    this.auth.user$
      .pipe(first(), untilDestroyed(this))
      .pipe(switchMap((user) => this.api.rooms.createRoom(user.id, data)))
      .subscribe((roomId) => this.router.navigate([`/room/${roomId}`]));
  }

  public async uploadImage(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      const upload = new Upload(input.files[0]);
      const result = await this.fileUpload.upload(upload);
      this.photoUrl = result.url;
    }
  }
}