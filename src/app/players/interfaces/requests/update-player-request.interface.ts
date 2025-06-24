import { Player } from '@players/interfaces/responses/player.interface';

export interface UpdatePlayerRequest {
  playerId: Player['playerId'];
  name: string;
}
