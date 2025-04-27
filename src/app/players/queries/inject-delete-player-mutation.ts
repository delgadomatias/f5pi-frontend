import { inject } from '@angular/core';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { Player } from '@players/interfaces/player.interface';
import { GET_PLAYERS_KEY } from '@players/players.constants';
import { PlayersService } from '@players/players.service';

export function injectDeletePlayerMutation() {
  const playersService = inject(PlayersService);
  const queryClient = inject(QueryClient);
  return injectMutation(() => ({
    mutationFn: (playerId: Player['playerId']) => lastValueFrom(playersService.deletePlayer(playerId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_PLAYERS_KEY] })
  }));
}