import { inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { GamesService } from '@games/games.service';
import { CreateGameDetailRequest } from '@games/interfaces/create-game-detail-request.interface';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';

export function injectCreateGameMutation() {
  const gamesService = inject(GamesService);
  return injectMutation(() => ({
    mutationFn: ({ game, detail }: { game: CreateGameRequest; detail: CreateGameDetailRequest }) =>
      lastValueFrom(gamesService.createGameWithDetail(game, detail)),
    onSuccess: () => gamesService.handleOnSuccessMutation(),
  }));
}
