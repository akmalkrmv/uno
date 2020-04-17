const KOZER = 'yurek';

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
function compare(kartaA, kartaB) {
  if (kartaA.suit == kartaB.suit) {
    // Agar mast bir hil bo'sa
    return kartaA.index > kartaB.index;
  } 
  
   // Agar mast KOZER bo'sa
   return kartaA.suit == KOZER;
}

// Algorithm 2
// function compare(kartaA, kartaB) {
//   const indexA = kartaA.suit == KOZER ? kartaA.index : kartaA.index + 10;
//   const indexB = kartaB.suit == KOZER ? kartaB.index : kartaB.index + 10;

//   return indexA > indexB;
// }
