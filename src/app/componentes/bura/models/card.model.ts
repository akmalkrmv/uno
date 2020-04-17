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

  public static compare(first: Card, second: Card, trump?: CardSuit) {
    // compare beatpoints
    if (first.beatpoint < second.beatpoint) {
      return 1;
    } else if (first.beatpoint > second.beatpoint) {
      return -1;
    }

    // compare names
    if (first.name < second.name) {
      return 1;
    } else if (first.name > second.name) {
      return -1;
    }

    return 0;
  }
}
