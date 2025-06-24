import { inject } from '@angular/core';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { GetSeasonsService } from '@seasons/services/get-seasons.service';
import { SeasonsService } from '@seasons/services/seasons.service';

export const INFINITE_SEASONS_QUERY_KEY = 'INFINITE_SEASONS_QUERY';

export function injectGetInfiniteSeasonsQuery() {
  const seasonsService = inject(SeasonsService);
  const getSeasonsService = inject(GetSeasonsService);
  return injectInfiniteQuery(() => ({
    queryKey: [INFINITE_SEASONS_QUERY_KEY],
    queryFn: ({ pageParam = 0 }) =>
      lastValueFrom(seasonsService.getSeasons({ pageNumber: pageParam, pageSize: getSeasonsService.pageSize() })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
  }));
}
