import { inject } from '@angular/core';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { PlayersService } from '@players/services/players.service';

export const GET_INFINITE_PLAYERS_QUERY_KEY = 'GET_INFINITE_PLAYERS_QUERY';

export function injectGetInfinitePlayersQuery() {
  const playersService = inject(PlayersService);

  return injectInfiniteQuery(() => ({
    queryKey: [GET_INFINITE_PLAYERS_QUERY_KEY],
    queryFn: ({ pageParam = 0 }) => lastValueFrom(playersService.getPlayers({ pageNumber: pageParam, pageSize: 20 })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
  }));
}
