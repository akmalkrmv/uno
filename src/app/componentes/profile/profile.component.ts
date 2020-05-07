import { Component, OnInit, Input } from '@angular/core';
import { UploadService, Upload } from '@services/upload.service';
import { ApiService } from '@services/repository/api.service';
import { User } from '@models/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input() user: User;

  public upload: Upload;

  constructor(private fileUpload: UploadService, private api: ApiService) {}

  ngOnInit(): void {}

  uploadImage(files: FileList) {
    if (files && files.length) {
      this.upload = new Upload(files[0]);
      this.fileUpload.upload(this.upload).then((upload) => {
        this.api.users.update({ ...this.user, photoURL: upload.url });
      });
    }
  }
}
