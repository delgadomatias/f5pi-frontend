import { computed, signal } from '@angular/core';

import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';

/**
 * Creates a pagination handler with reactive signals for managing page number and page size.
 *
 * @param defaultValues - Partial pagination parameters to override defaults
 * @param defaultValues.pageNumber - The initial page number
 * @param defaultValues.pageSize - The initial page size
 *
 * @returns An object containing:
 * - `getPageNumber`: Computed signal that returns the current page number
 * - `getPageSize`: Computed signal that returns the current page size
 * - `setPageNumber`: Function to update the page number
 * - `setPageSize`: Function to update the page size
 *
 * @example
 * ```typescript
 * const pagination = paginationHandler({ pageNumber: 1, pageSize: 10 });
 *
 * // Get current values
 * const currentPage = pagination.getPageNumber();
 * const currentSize = pagination.getPageSize();
 *
 * // Update values
 * pagination.setPageNumber(2);
 * pagination.setPageSize(20);
 * ```
 */
export function paginationHandler(defaultValues: Partial<PaginatedRequest> = DEFAULT_PAGINATION_PARAMS) {
  const _pageNumber = signal<number>(defaultValues.pageNumber ?? DEFAULT_PAGINATION_PARAMS.pageNumber);
  const _pageSize = signal<number>(defaultValues.pageSize ?? DEFAULT_PAGINATION_PARAMS.pageSize);

  const getPageNumber = computed(() => _pageNumber());
  const getPageSize = computed(() => _pageSize());
  const setPageNumber = (pageNumber: number): void => _pageNumber.set(pageNumber);
  const setPageSize = (pageSize: number): void => _pageSize.set(pageSize);

  return { getPageNumber, getPageSize, setPageNumber, setPageSize };
}
