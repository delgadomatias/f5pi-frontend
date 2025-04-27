import { inject } from "@angular/core";
import { injectInfiniteQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { GET_FIELDS_KEY } from "@fields/fields.constants";
import { FieldsService } from "@fields/fields.service";
import { injectGetFieldsQuery } from "@fields/queries/inject-get-fields-query";

export function injectGetInfiniteFieldsQuery() {
  const fieldsService = inject(FieldsService);
  const getFieldsQuery = injectGetFieldsQuery();

  return injectInfiniteQuery(() => ({
    queryKey: [GET_FIELDS_KEY],
    queryFn: ({ pageParam = 0 }) =>
      lastValueFrom(fieldsService.getFields({ pageNumber: pageParam })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    initialData: getFieldsQuery.query.data()
      ? { pages: [getFieldsQuery.query.data()], pageParams: [0] }
      : undefined,
  }))
}