import { inject } from "@angular/core";
import { injectInfiniteQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { injectGetSeasonsQuery } from "@seasons/queries/inject-get-seasons-query";
import { GET_SEASONS_KEY } from "@seasons/seasons.constants";
import { SeasonsService } from "@seasons/seasons.service";

export function injectGetInfiniteSeasonsQuery() {
  const seasonsService = inject(SeasonsService);
  const getSeasonsQuery = injectGetSeasonsQuery();

  return injectInfiniteQuery(() => ({
    queryKey: [GET_SEASONS_KEY],
    queryFn: ({ pageParam = 0 }) =>
      lastValueFrom(seasonsService.getSeasons({ pageNumber: pageParam })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    initialData: getSeasonsQuery.query.data()
      ? { pages: [getSeasonsQuery.query.data()], pageParams: [0] }
      : undefined,
  }))
}
