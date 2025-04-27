import { inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';

export function injectDeleteGameMutation() {
  const gamesService = inject(GamesService);
  return injectMutation(() => ({
    mutationFn: (gameId: Game['gameId']) => lastValueFrom(gamesService.deleteGame(gameId)),
    onSuccess: () => gamesService.handleOnSuccessMutation(),
  }));
}
