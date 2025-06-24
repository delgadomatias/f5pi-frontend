import { HttpParams } from '@angular/common/http';

/**
 * Creates HTTP parameters for pagination requests.
 *
 * @param pageNumber - The page number to retrieve (1-based indexing)
 * @param pageSize - The number of items per page
 * @returns HttpParams object containing the pagination parameters
 *
 * @example
 * ```typescript
 * const params = createPaginationParams(1, 10);
 * // Returns HttpParams with pageNumber=1 and pageSize=10
 * ```
 */
export function createPaginationParams(pageNumber: number, pageSize: number): HttpParams {
  return new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
}
