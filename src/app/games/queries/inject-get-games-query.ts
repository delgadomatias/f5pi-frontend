import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { usePagination } from '@common/use-pagination';
import { GET_GAMES_KEY } from '@games/games.constants';
import { GamesService } from '@games/games.service';

export function injectGetGamesQuery() {
  const gamesService = inject(GamesService);
  const { pageNumber, setPageNumber } = usePagination();

  return {
    pageNumber,
    setPageNumber,
    query: injectQuery(() => ({
      queryFn: () => lastValueFrom(gamesService.getGames({ pageNumber: pageNumber() })),
      queryKey: [GET_GAMES_KEY, pageNumber()],
    }))
  }
}
