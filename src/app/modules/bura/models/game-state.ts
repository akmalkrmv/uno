import { IPlayer } from './player';
import { Card } from './card.model';
import { MoveState } from './move-state';
import { GameOptions } from './game-options';
import { GameStats } from './game-stats';

export interface IGameInitData {
  state?: 'empty' | 'new' | string;
  roomId: string;
  playerId: string;
  options: GameOptions;
  isCreator: boolean;
}

export interface IGame {
  id?: string;
  roomId: string;
  creatorId?: string;

  players: IPlayer[];
  current?: IPlayer;
  beater?: IPlayer;

  deck: Card[];
  table: Card[];
  beatingCards?: Card[];
  trump?: Card;

  moves: number;
  state: MoveState;
  stats: GameStats;
  options: GameOptions;
}
