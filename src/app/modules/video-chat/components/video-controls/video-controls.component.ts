import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss'],
})
export class VideoControlsComponent implements OnInit {
  @Input() user: User;

  public isAudioOn$ = new BehaviorSubject(true);
  public isVideoOn$ = new BehaviorSubject(true);
  public isFront$ = new BehaviorSubject(true);
  public canFlipCamera = false;

  private videoDevices: MediaDeviceInfo[] = [];
  private currentDevice: MediaDeviceInfo = null;

  constructor() {}

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.videoDevices = devices.filter(
        (device) => device.kind == 'videoinput'
      );
      this.canFlipCamera = this.videoDevices.length > 1 || true;
      this.currentDevice = this.videoDevices[0];
    });
  }

  public toggleSound() {
    this.isAudioOn$.next(!this.isAudioOn$.value);
    this.user.toggleAudio();
  }

  public toggleVideo() {
    this.isVideoOn$.next(!this.isVideoOn$.value);
    this.user.toggleVideo();
  }

  public flipCamera() {
    const index = this.videoDevices.indexOf(this.currentDevice);

    this.currentDevice = this.videoDevices[
      (index + 1) % this.videoDevices.length
    ];

    this.isFront$.next(!this.isFront$.value);
    this.user.toggleCamera(this.currentDevice);
    this.user.isFrontCamera = this.isFront$.value;
  }
}
