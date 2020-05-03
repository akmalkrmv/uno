import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { User, Connection } from '@models/index';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.scss'],
})
export class VideoItemComponent implements OnInit {
  @Input() user: User;
  @Input() connection: Connection;
  @ViewChild('video') videoRef: ElementRef<HTMLVideoElement>;

  constructor() {}

  ngOnInit(): void {}

  public fullscreen() {
    const video = this.videoRef.nativeElement;

    if (video.requestFullscreen) {
      video.requestFullscreen().catch((error) => console.log(error));
    }
  }

  public pictureInPicture() {
    // Make type any untill HTMLVideoElement supports requestPictureInPicture function
    const video: any = this.videoRef.nativeElement;

    if (video.requestPictureInPicture) {
      video.requestPictureInPicture().catch((error) => console.log(error));
    }
  }
}
