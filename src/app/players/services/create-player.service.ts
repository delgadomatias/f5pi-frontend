import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { of, switchMap, tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { CreatePlayerRequest } from '@players/interfaces/requests/create-player-request.interface';
import { Player } from '@players/interfaces/responses/player.interface';
import { GET_INFINITE_PLAYERS_QUERY_KEY } from '@players/queries/inject-get-infinite-players-query';
import { GetPlayersService } from '@players/services/get-players.service';
import { PlayersService } from '@players/services/players.service';

@Injectable()
export class CreatePlayerService {
  private readonly playersService = inject(PlayersService);
  private readonly getPlayersService = inject(GetPlayersService);
  private readonly queryClient = inject(QueryClient);
  private readonly mutation = mutationPerformer<Player>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(request: CreatePlayerRequest & { image: File | null }) {
    return this.mutation
      .mutate(() =>
        this.playersService.createPlayer({ name: request.name }).pipe(
          switchMap((player) => {
            if (request.image) {
              return this.playersService
                .uploadPlayerImage({ playerId: player.playerId, image: request.image })
                .pipe(switchMap(() => of(player)));
            }
            return of(player);
          })
        )
      )
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getPlayersService.reload();
    this.queryClient.invalidateQueries({ queryKey: [GET_INFINITE_PLAYERS_QUERY_KEY] });
  }
}
