import { inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { GET_GAMES_KEY } from '@games/games.constants';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';

export function injectGetGameDetailQuery(gameId: Game['gameId']) {
  const gamesService = inject(GamesService);
  return injectQuery(() => ({
    queryFn: () => lastValueFrom(gamesService.getGameDetail(gameId)),
    queryKey: [GET_GAMES_KEY, gameId],
  }));
}
