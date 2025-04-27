import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { usePagination } from '@common/use-pagination';
import { GET_PLAYERS_KEY } from '@players/players.constants';
import { PlayersService } from '@players/players.service';

export function injectGetPlayersQuery() {
  const playersService = inject(PlayersService);
  const { pageNumber, setPageNumber } = usePagination();

  return {
    pageNumber,
    setPageNumber,
    query: injectQuery(() => ({
      queryFn: () => lastValueFrom(playersService.getPlayers({ pageNumber: pageNumber() })),
      queryKey: [GET_PLAYERS_KEY, pageNumber()],
    }))
  }
}