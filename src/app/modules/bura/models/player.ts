import { Card } from './card.model';

export interface IPlayer {
  id: string;
  name: string;
  hand: Card[];
  pointCards: Card[];
  isCreator?: boolean;
}
