import { computed } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { PaginatedResponse } from '@common/interfaces/paginated-response.interface';
import { paginationHandler } from '@common/utils/pagination-handler';

export abstract class BasePaginatedResourceService<T extends PaginatedResponse<unknown>> {
  protected readonly pagination = paginationHandler();
  protected readonly resource = rxResource({
    params: () => ({
      pageNumber: this.pagination.getPageNumber(),
      pageSize: this.pagination.getPageSize(),
    }),
    stream: ({ params }) => this.getResourceStream(params),
  });

  // Abstract method that subclasses must implement
  protected abstract getResourceStream(params: PaginatedRequest): Observable<T>;

  // Common computed properties
  error = computed(() => this.resource.error());
  isLoading = computed(() => this.resource.isLoading());
  response = computed(() => this.resource.value(), { equal: (_, b) => b === undefined });

  // Pagination properties
  pageNumber = computed(() => this.pagination.getPageNumber());
  pageSize = computed(() => this.pagination.getPageSize());
  totalElements = computed(() => this.response()?.totalElements || 0);

  setPageNumber = (pageNumber: number) => this.pagination.setPageNumber(pageNumber);
  setPageSize = (pageSize: number) => this.pagination.setPageSize(pageSize);
  reload = () => this.resource.reload();
}
