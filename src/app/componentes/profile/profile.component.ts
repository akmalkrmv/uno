import { Component, OnInit, Input } from '@angular/core';
import { UploadService, Upload } from '@services/upload.service';
import { ApiService } from '@services/repository/api.service';
import { IUser } from '@models/index';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() user: IUser;

  public upload: Upload;

  constructor(
    private fileUpload: UploadService,
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {}

  uploadImage(files: FileList) {
    if (!files) return;
    if (!files.length) return;

    this.upload = new Upload(files[0]);

    this.fileUpload.upload(this.upload).then((upload) => {
      // Delete old photo to save space
      // this.fileUpload.deleteUpload(this.user.photoURL);

      // Update users photo url
      this.api.users
        .update({ ...this.user, photoURL: upload.url })
        .then(() => this.auth.refresh());
    });
  }
}
