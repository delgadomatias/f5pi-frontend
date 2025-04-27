import { inject } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { usePagination } from "@common/use-pagination";
import { GET_FIELDS_KEY } from "@fields/fields.constants";
import { FieldsService } from "@fields/fields.service";

export function injectGetFieldsQuery() {
  const fieldsService = inject(FieldsService);
  const { pageNumber, setPageNumber } = usePagination();

  return {
    pageNumber,
    setPageNumber,
    query: injectQuery(() => ({
      queryFn: () => lastValueFrom(fieldsService.getFields({ pageNumber: pageNumber() })),
      queryKey: [GET_FIELDS_KEY, pageNumber()],
    }))
  }
}