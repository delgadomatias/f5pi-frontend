import { PaginationResponse } from '@common/interfaces/pagination-response.interface';
import { Player } from '@players/interfaces/player.interface';

export type PlayersResponse = PaginationResponse<Player>;
