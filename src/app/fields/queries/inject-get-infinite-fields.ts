import { inject } from '@angular/core';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { FieldsService } from '@fields/services/fields.service';
import { GetFieldsService } from '@fields/services/get-fields.service';

export const INFINITE_FIELDS_QUERY_KEY = 'INFINITE_FIELDS_QUERY';

export function injectGetInfiniteFieldsQuery() {
  const fieldsService = inject(FieldsService);
  const getFieldsService = inject(GetFieldsService);

  return injectInfiniteQuery(() => ({
    queryKey: [INFINITE_FIELDS_QUERY_KEY],
    queryFn: ({ pageParam = 0 }) =>
      lastValueFrom(fieldsService.getFields({ pageNumber: pageParam, pageSize: getFieldsService.pageSize() })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
  }));
}
