import { IPlayer } from './player';

export class GameStats {
  name: number;
  round: number = 0;
  players: IPlayer[] = [];
  lastWinners: string[] = [];
  points: Record<string, number> = {};
}
