import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { Season } from '@seasons/interfaces/responses/season.interface';

export type SeasonsResponse = PaginatedResponse<Season>;
