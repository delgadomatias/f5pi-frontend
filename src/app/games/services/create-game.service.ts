import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { GamesService } from '@games/games.service';
import { CreateGameDetailRequest } from '@games/interfaces/create-game-detail-request.interface';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { GameDetailResponse } from '@games/interfaces/game-detail-response.interface';
import { GetGamesService } from '@games/services/get-games.service';

@Injectable()
export class CreateGameService {
  private readonly gamesService = inject(GamesService);
  private readonly getGamesService = inject(GetGamesService);
  private readonly mutation = mutationPerformer<GameDetailResponse>();

  error = this.mutation.error;
  isPending = this.mutation.isPending;

  execute({ game, detail }: { game: CreateGameRequest; detail: CreateGameDetailRequest }) {
    return this.mutation
      .mutate(() => this.gamesService.createGameWithDetail(game, detail))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getGamesService.reload();
  }
}
