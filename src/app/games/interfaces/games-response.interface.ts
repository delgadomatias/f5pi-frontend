import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Game } from '@games/interfaces/game.interface';

export type GamesResponse = PaginatedResponse<Game>;
