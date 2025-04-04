export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}
