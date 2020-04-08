export const rtcConfiguration: RTCConfiguration = {};

export const vgaConstraints: MediaStreamConstraints = {
  audio: true,
  video: { width: { exact: 320 }, height: { exact: 240 } },
};

export const offerOptions: RTCOfferOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
};
