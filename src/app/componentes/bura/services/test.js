const suits = { club: 0, heart: 1, diamond: 2, spade: 3 };
const TRUMP = suits.spade;

const table = [
  { index: 7, suit: suits.heart },
  { index: 8, suit: suits.heart },
  { index: 9, suit: suits.heart },
];
const hand = [
  { index: 6, suit: suits.spade },
  { index: 10, suit: suits.heart },
  { index: 14, suit: suits.heart },
];

function main() {
  console.log('beats: ', { hand, table, beats: beats(hand, table) });
}

function beats(hand, table) {
  hand = hand.sort((cardA, cardB) => compare(cardA, cardB));
  table = table.sort((cardA, cardB) => compare(cardA, cardB));

  for (let index = 0; index < hand.length; index++) {
    if (!compare(hand[index], table[index])) {
      return false;
    }
  }

  return true;
}

// Algorithm 1
// function compare(cardA, cardB) {
//   if (cardA.suit == cardB.suit) {
//     return cardA.index > cardB.index;
//   }
//
//    return cardA.suit == TRUMP;
// }

// Algorithm 2
function compare(cardA, cardB) {
  const indexA = cardA.suit == TRUMP ? cardA.index : cardA.index + 10;
  const indexB = cardB.suit == TRUMP ? cardB.index : cardB.index + 10;

  return indexA > indexB;
}

//
//
//
//
//
//
//
// Device managements
navigator.mediaDevices.enumerateDevices().then((devices) => {
  const videoDevices = devices.filter((device) => device.kind == 'videoinput');
  const constaints = {
    video: { deviceId: { exact: videoDevices[0].deviceId } },
  };

  console.log(videoDevices[0]);

  navigator.mediaDevices.getUserMedia(constaints).then((stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    console.log(videoTrack);
  });
});

//
//
//
//
//
//
//
// POLITENESS
io.onmessage = async ({ data: { description, candidate } }) => {
  if (description) await descriptionHandler(description);
  if (candidate) await candidateHandler(candidate);
};

async function candidateHandler(candidate) {
  await pc.addIceCandidate(candidate);
}

async function descriptionHandler(description) {
  const isOffer = description.type == 'offer';
  const isStable = pc.signalingState == 'stable';

  if (isOffer && !isStable && !polite) {
    return; // return the fuck out
  }

  if (isOffer && !isStable) {
    await Promise.all([
      pc.setLocalDescription({ type: 'rollback' }),
      pc.setRemoteDescription(description),
    ]);
  }

  if (!isOffer || isStable) {
    await pc.setRemoteDescription(description);
  }

  if (isOffer) {
    await pc.setLocalDescription(await pc.createAnswer());
    io.send({ description: pc.localDescription });
  }
}

async function offer(description) {
  const isStable = pc.signalingState == 'stable';

  if (!isStable && !polite) {
    return; // return the fuck out
  } else {
    if (!isStable) {
      await Promise.all([
        pc.setLocalDescription({ type: 'rollback' }),
        pc.setRemoteDescription(description),
      ]);
    }

    if (isStable) {
      await pc.setRemoteDescription(description);
    }

    await pc.setLocalDescription(await pc.createAnswer());
    io.send({ description: pc.localDescription });
  }
}

async function offer(description) {
  const isStable = pc.signalingState == 'stable';

  if (!isStable && !polite) {
    return; // return the fuck out
  }

  if (!isStable) {
    await Promise.all([
      pc.setLocalDescription({ type: 'rollback' }),
      pc.setRemoteDescription(description),
    ]);
  }

  if (isStable) {
    await pc.setRemoteDescription(description);
  }

  await pc.setLocalDescription(await pc.createAnswer());
  io.send({ description: pc.localDescription });
}
async function descriptionHandler(description) {
  if (description.type != 'offer') {
    await pc.setRemoteDescription(description);
    return;
  }

  if (pc.signalingState != 'stable' && polite) {
    await Promise.all([
      pc.setLocalDescription({ type: 'rollback' }),
      pc.setRemoteDescription(description),
    ]);
  }

  await pc.setLocalDescription(await pc.createAnswer());
  io.send({ description: pc.localDescription });
}
