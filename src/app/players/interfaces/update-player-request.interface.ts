import { Player } from './player.interface';

export interface UpdatePlayerRequest {
  playerId: Player['playerId'];
  name: string;
}
