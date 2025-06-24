export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}
