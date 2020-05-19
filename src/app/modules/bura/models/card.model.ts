export const CardNameMap: Record<number, string> = {
  '11': 'J',
  '12': 'Q',
  '13': 'K',
  '14': 'A',
};

export const CardPointMap: Record<number, number> = {
  '10': 10,
  '11': 2,
  '12': 3,
  '13': 4,
  '14': 11,
};

export const CardBeatPointMap: Record<number, number> = {
  '10': 20,
  '14': 21,
};

export enum CardSuit {
  'club' = 'club',
  'diamond' = 'diamond',
  'heart' = 'heart',
  'spade' = 'spade',
}

export class Card {
  public name: string;
  public point: number;
  public beatpoint: number;

  public visible = true;
  public selected = false;
  public disabled = false;

  constructor(public index: number, public suit: CardSuit) {
    this.name = CardNameMap[index] || index.toString();
    this.point = CardPointMap[index] || 0;
    this.beatpoint = CardBeatPointMap[index] || index;
  }

  public static compare(a: Card, b: Card, trump?: CardSuit) {
    // increase trump suit
    let suitA = a.suit.charCodeAt(0);
    let suitB = b.suit.charCodeAt(0);
    suitA = a.suit == trump ? suitA + 100 : suitA;
    suitB = b.suit == trump ? suitB + 100 : suitB;

    // compare suits
    if (suitA < suitB) return 1;
    if (suitA > suitB) return -1;

    // increase beating ponts
    const pointA = a.suit == trump ? a.beatpoint + 100 : a.beatpoint;
    const pointB = b.suit == trump ? b.beatpoint + 100 : b.beatpoint;

    // compare beatpoints
    if (pointA < pointB) return 1;
    if (pointA > pointB) return -1;

    return 0;
  }
}
