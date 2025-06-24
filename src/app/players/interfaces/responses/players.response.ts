import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Player } from '@players/interfaces/responses/player.interface';

export type PlayersResponse = PaginatedResponse<Player>;
