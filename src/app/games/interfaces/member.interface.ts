import { Player } from '@players/interfaces/player.interface';

export interface Member {
  playerId: Player;
  goalsScored: number;
  ownGoals: number;
}
