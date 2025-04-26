import { Player } from '@players/interfaces/player.interface';

export interface Member {
  playerId: Player['playerId'];
  goalsScored: number;
  ownGoals: number;
}
