import { inject } from "@angular/core";
import { injectQuery, keepPreviousData } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { usePagination } from "@common/use-pagination";
import { GET_SEASONS_KEY } from "@seasons/seasons.constants";
import { SeasonsService } from "@seasons/seasons.service";

export function injectGetSeasonsQuery() {
  const seasonsService = inject(SeasonsService);
  const { pageNumber, setPageNumber } = usePagination();

  return {
    pageNumber,
    setPageNumber,
    query: injectQuery(() => ({
      placeholderData: keepPreviousData,
      queryFn: () => lastValueFrom(seasonsService.getSeasons({ pageNumber: pageNumber() })),
      queryKey: [GET_SEASONS_KEY, pageNumber()],
    }))
  }
}
