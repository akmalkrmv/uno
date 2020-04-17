const TRUMP = 'yurek';

const table = [
  { index: 7, suit: 'qarga' },
  { index: 8, suit: 'qarga' },
  { index: 9, suit: 'qarga' },
];
const hand = [
  { index: 10, suit: 'qarga' },
  { index: 6, suit: 'yurek' },
  { index: 14, suit: 'qarga' },
];

function main() {
  console.log('bosadi: ', bosadi(hand, table));
}

function bosadi(hand, table) {
  // sotirng
  hand = hand.sort((kartaA, kartaB) => {
    // algoritm
    return compare(kartaA, kartaB);
  });

  // sotirng
  table = table.sort((kartaA, kartaB) => {
    // algoritm
    return compare(kartaA, kartaB);
  });

  for (let index = 0; index < hand.length; index++) {
    // algoritm
    if (!compare(hand[index], table[index])) {
      return false;
    }
  }

  return true;
}

// Algorithm 1
// function compare(kartaA, kartaB) {
//   if (kartaA.suit == kartaB.suit) {
//     // Agar mast bir hil bo'sa
//     return kartaA.index > kartaB.index;
//   }

//    // Agar mast KOZER bo'sa
//    return kartaA.suit == TRUMP;
// }

// Algorithm 2
function compare(kartaA, kartaB) {
  const indexA = kartaA.suit == TRUMP ? kartaA.index : kartaA.index + 10;
  const indexB = kartaB.suit == TRUMP ? kartaB.index : kartaB.index + 10;

  return indexA > indexB;
}

navigator.mediaDevices.enumerateDevices().then((devices) => {
  const videoDevices = devices.filter((device) => device.kind == 'videoinput');
  const constaints = {
    video: {
      deviceId: {
        exact: videoDevices[0].deviceId,
      },
    },
  };

  console.log(videoDevices[0]);


  navigator.mediaDevices.getUserMedia(constaints).then((stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    console.log(videoTrack);
  });
});
