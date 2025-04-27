import { inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { UpdatePlayerRequest } from '@players/interfaces/update-player-request.interface';
import { PlayersService } from '@players/players.service';

export function injectUpdatePlayerMutation() {
  const playersService = inject(PlayersService);
  return injectMutation(() => ({
    mutationFn: (request: UpdatePlayerRequest) => lastValueFrom(playersService.updatePlayer(request)),
    onSuccess: () => playersService.handleOnSuccessMutation(),
  }));
}