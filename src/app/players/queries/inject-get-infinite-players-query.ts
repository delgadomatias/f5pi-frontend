import { inject } from "@angular/core";
import { injectInfiniteQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { GET_PLAYERS_KEY } from "@players/players.constants";
import { PlayersService } from "@players/players.service";
import { injectGetPlayersQuery } from "@players/queries/inject-get-players-query";

export function injectGetInfinitePlayersQuery() {
  const playersService = inject(PlayersService);
  const getPlayersQuery = injectGetPlayersQuery();

  return injectInfiniteQuery(() => ({
    queryKey: [GET_PLAYERS_KEY],
    queryFn: ({ pageParam = 0 }) =>
      lastValueFrom(playersService.getPlayers({ pageNumber: pageParam })),
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const { number, totalPages } = lastPage;
      return number + 1 < totalPages ? number + 1 : undefined;
    },
    initialPageParam: 0,
    initialData: getPlayersQuery.query.data()
      ? { pages: [getPlayersQuery.query.data()], pageParams: [0] }
      : undefined,
  }))
}
