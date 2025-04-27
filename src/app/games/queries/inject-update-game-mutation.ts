import { inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';
import { UpdateGameRequest } from '@games/interfaces/update-game-request.interface';

export function injectUpdateGameMutation() {
  const gamesService = inject(GamesService);
  return injectMutation(() => ({
    mutationFn: ({ gameId, request }: { gameId: Game['gameId']; request: UpdateGameRequest }) =>
      lastValueFrom(gamesService.updateGame(gameId, request)),
    onSuccess: () => gamesService.handleOnSuccessMutation(),
  }));
}
