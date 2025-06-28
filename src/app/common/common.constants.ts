import { environment } from '@environments/environment';
import { PaginatedRequest } from './interfaces/paginated-request.interface';

export const BASE_USERS_URL = `${environment.API_URL}/api/v1/users`;

export const DEFAULT_PAGINATION_PARAMS = {
  pageNumber: 0,
  pageSize: 20,
} satisfies PaginatedRequest;

export const THEME_STORAGE_NAME = 'theme';
export const DEFAULT_THEME = 'dark';

export const ROUTES_PATHS = {
  CHECK_TOKEN: `${environment.API_URL}/auth/check-token`,
  LOGIN: `${environment.API_URL}/auth/login`,
  REGISTER: `${environment.API_URL}/auth/register`,
};

export const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';
