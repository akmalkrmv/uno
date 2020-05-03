import { Injectable } from '@angular/core';
import { videoConstraints } from '@constants/index';
import { User } from '@models/index';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor() {}

  public setStream(user: User) {
    if (!user) return;

    const userStream = new MediaStream();
    const addTracks = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => userStream.addTrack(track));
    };

    // Adding audio tracks
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => addTracks(stream))
      .catch((error) => console.log(error));

    // Adding video tracks
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then((stream) => addTracks(stream))
      .catch((error) => console.log(error));

    if (userStream.getTracks().length > 0) {
      user.stream = userStream;
      this.muteSelfStream();
    }
  }

  public closeStream(user: User) {
    if (!user) return;
    if (!user.stream) return;

    user.stream.getTracks().forEach((track) => {
      track.stop();
      user.stream.removeTrack(track);
    });

    user.stream = null;
  }

  public requestMedia(user: User) {
    this.setStream(user);
  }

  public muteSelfStream() {
    setTimeout(() => {
      const currentVideo = document.querySelector('#self-video');
      currentVideo && ((currentVideo as HTMLVideoElement).volume = 0);
    }, 100);
  }
}
