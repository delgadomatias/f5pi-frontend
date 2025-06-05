import { environment } from '@environments/environment';
import { PaginatedRequest } from './interfaces/paginated-request.interface';

export const DEFAULT_PAGINATION_PARAMS: PaginatedRequest = {
  pageNumber: 0,
};

export const THEME_STORAGE_NAME = 'theme';
export const DEFAULT_THEME = 'dark';

export const ROUTES_PATHS = {
  CHECK_TOKEN: `${environment.apiUrl}/auth/check-token`,
  LOGIN: `${environment.apiUrl}/auth/login`,
  REGISTER: `${environment.apiUrl}/auth/register`,
};
