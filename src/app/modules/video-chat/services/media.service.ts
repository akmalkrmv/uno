import { Injectable } from '@angular/core';
import { videoConstraints } from '@constants/index';
import { User } from '@models/index';

@Injectable({ providedIn: 'root' })
export class MediaService {
  constructor() {}

  public async setStream(user: User, media: 'user' | 'display' = 'user') {
    if (!user) return;

    const userStream = new MediaStream();
    const addTracks = (stream: MediaStream) => {
      stream.getTracks().forEach((track) => userStream.addTrack(track));
    };

    // Adding audio tracks
    const audioStream = navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => addTracks(stream))
      .catch((error) => console.log(error));

    // Adding video tracks
    let videoStream = null;
    if (media === 'user')
      videoStream = navigator.mediaDevices
        .getUserMedia({ video: videoConstraints })
        .then((stream) => addTracks(stream))
        .catch((error) => console.log(error));
    else {
      videoStream = (navigator.mediaDevices as any)
        .getDisplayMedia()
        .then((stream) => addTracks(stream))
        .catch((error) => console.log(error));
    }

    return Promise.all([audioStream, videoStream]).then(() => {
      if (userStream.getTracks().length > 0) {
        if (user.stream) {
          // Stop current tracks
          user.stream.getTracks().forEach((track) => track.stop());
          // Replace connection tracks with new tracks
          userStream.getTracks().forEach((track) => user.replaceTrack(track));
        }

        user.stream = userStream;
        user.connections.forEach((c) => user.addTracks(c.peer));

        this.muteSelfStream();
      }
    });
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
