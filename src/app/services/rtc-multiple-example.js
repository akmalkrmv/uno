/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

const video_me_ = document.querySelector('video#video1');
const video_alice_ = document.querySelector('video#video2');
const video_bob_ = document.querySelector('video#video3');

let _alice_Local;
let _alice_Remote;
let _bob_Local;
let _bob_Remote;
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function gotStream(stream) {
  console.log('Received local stream');
  video_me_.srcObject = stream;
  window.localStream = stream;
  callButton.disabled = false;
}

function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then(gotStream)
      .catch(e => console.log('getUserMedia() error: ', e));
}

function call() {
  callButton.disabled = true;
  hangupButton.disabled = false;
  console.log('Starting calls');

  const audioTracks = window.localStream.getAudioTracks();
  const videoTracks = window.localStream.getVideoTracks();

  if (audioTracks.length > 0) {
    console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  if (videoTracks.length > 0) {
    console.log(`Using video device: ${videoTracks[0].label}`);
  }
  
  // Create an RTCPeerConnection via the polyfill.
  const servers = null;
  _alice_Local = new RTCPeerConnection(servers);
  _alice_Remote = new RTCPeerConnection(servers);
  _alice_Remote.ontrack = gotRemoteStream_alice_;
  _alice_Local.onicecandidate = iceCallback1Local;
  _alice_Remote.onicecandidate = iceCallback1Remote;
  console.log('pc1: created local and remote peer connection objects');

  _bob_Local = new RTCPeerConnection(servers);
  _bob_Remote = new RTCPeerConnection(servers);
  _bob_Remote.ontrack = gotRemoteStream_bob_;
  _bob_Local.onicecandidate = iceCallback2Local;
  _bob_Remote.onicecandidate = iceCallback2Remote;
  console.log('pc2: created local and remote peer connection objects');

  window.localStream.getTracks().forEach(track => _alice_Local.addTrack(track, window.localStream));
  console.log('Adding local stream to pc1Local');
  _alice_Local
      .createOffer(offerOptions)
      .then(gotDescription_alice_Local, onCreateSessionDescriptionError);

  window.localStream.getTracks().forEach(track => _bob_Local.addTrack(track, window.localStream));
  console.log('Adding local stream to pc2Local');
  _bob_Local.createOffer(offerOptions)
      .then(gotDescription_bob_Local, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
  console.log(`Failed to create session description: ${error.toString()}`);
}

function gotDescription_alice_Local(desc) {
  _alice_Local.setLocalDescription(desc);
  console.log(`Offer from pc1Local\n${desc.sdp}`);
  _alice_Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  _alice_Remote.createAnswer().then(gotDescription_alice_Remote, onCreateSessionDescriptionError);
}

function gotDescription_alice_Remote(desc) {
  _alice_Remote.setLocalDescription(desc);
  console.log(`Answer from pc1Remote\n${desc.sdp}`);
  _alice_Local.setRemoteDescription(desc);
}

function gotDescription_bob_Local(desc) {
  _bob_Local.setLocalDescription(desc);
  console.log(`Offer from pc2Local\n${desc.sdp}`);
  _bob_Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  _bob_Remote.createAnswer().then(gotDescription_bob_Remote, onCreateSessionDescriptionError);
}

function gotDescription_bob_Remote(desc) {
  _bob_Remote.setLocalDescription(desc);
  console.log(`Answer from pc2Remote\n${desc.sdp}`);
  _bob_Local.setRemoteDescription(desc);
}

function hangup() {
  console.log('Ending calls');
  _alice_Local.close();
  _alice_Remote.close();
  _bob_Local.close();
  _bob_Remote.close();
  _alice_Local = _alice_Remote = null;
  _bob_Local = _bob_Remote = null;
  hangupButton.disabled = true;
  callButton.disabled = false;
}

function gotRemoteStream_alice_(e) {
  if (video_alice_.srcObject !== e.streams[0]) {
    video_alice_.srcObject = e.streams[0];
    console.log('pc1: received remote stream');
  }
}

function gotRemoteStream_bob_(e) {
  if (video_bob_.srcObject !== e.streams[0]) {
    video_bob_.srcObject = e.streams[0];
    console.log('pc2: received remote stream');
  }
}

function iceCallback1Local(event) {
  handleCandidate(event.candidate, _alice_Remote, 'pc1: ', 'local');
}

function iceCallback1Remote(event) {
  handleCandidate(event.candidate, _alice_Local, 'pc1: ', 'remote');
}

function iceCallback2Local(event) {
  handleCandidate(event.candidate, _bob_Remote, 'pc2: ', 'local');
}

function iceCallback2Remote(event) {
  handleCandidate(event.candidate, _bob_Local, 'pc2: ', 'remote');
}

function handleCandidate(candidate, dest, prefix, type) {
  dest.addIceCandidate(candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
  console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log(`Failed to add ICE candidate: ${error.toString()}`);
}
