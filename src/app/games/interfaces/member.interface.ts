import { Player } from '@players/interfaces/responses/player.interface';

export interface Member {
  playerId: Player['playerId'];
  goalsScored: number;
  ownGoals: number;
}
