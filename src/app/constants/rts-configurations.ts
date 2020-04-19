export const rtcConfiguration: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
      ],
    },
  ],
};

export const videoConstraints: MediaTrackConstraints = {
  width: { exact: 320 },
  height: { exact: 240 },
  // facingMode: 'user',
};

export const vgaConstraints: MediaStreamConstraints = {
  audio: true,
  video: videoConstraints,
};

export const offerOptions: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
  iceRestart: true,
  voiceActivityDetection: true,
};
