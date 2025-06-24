import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { UpdatePlayerRequest } from '@players/interfaces/requests/update-player-request.interface';
import { Player } from '@players/interfaces/responses/player.interface';
import { GET_INFINITE_PLAYERS_QUERY_KEY } from '@players/queries/inject-get-infinite-players-query';
import { GetPlayersService } from '@players/services/get-players.service';
import { PlayersService } from '@players/services/players.service';

@Injectable()
export class UpdatePlayerService {
  private readonly playersService = inject(PlayersService);
  private readonly getPlayersService = inject(GetPlayersService);
  private readonly queryClient = inject(QueryClient);
  private readonly mutation = mutationPerformer<Player>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(updatePlayerRequest: UpdatePlayerRequest) {
    return this.mutation
      .mutate(() => this.playersService.updatePlayer(updatePlayerRequest))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getPlayersService.reload();
    this.queryClient.invalidateQueries({ queryKey: [GET_INFINITE_PLAYERS_QUERY_KEY] });
  }
}
