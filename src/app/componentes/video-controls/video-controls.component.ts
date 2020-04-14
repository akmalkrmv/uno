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

  public isAudioOn = new BehaviorSubject(true);
  public isVideoOn = new BehaviorSubject(true);
  public isFront = new BehaviorSubject(true);
  public canFlipCamera = false;

  constructor() {}

  ngOnInit(): void {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const inputs = devices.filter((device) => device.kind == 'videoinput');
      this.canFlipCamera = inputs.length > 1;
    });
  }

  public toggleSound() {
    this.isAudioOn.next(!this.isAudioOn.value);
    this.user.toggleAudio();
  }

  public toggleVideo() {
    this.isVideoOn.next(!this.isVideoOn.value);
    this.user.toggleVideo();
  }

  public flipCamera() {
    this.isFront.next(!this.isFront.value);
  }
}
