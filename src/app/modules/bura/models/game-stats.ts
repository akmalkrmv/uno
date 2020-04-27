import { Player } from './player';

export class GameStats {
  name: number;
  round: number = 0;
  players: Player[] = [];
  lastWinners: string[] = [];
  points: Record<string, number> = {};
}
