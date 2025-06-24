import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';
import { UpdateGameRequest } from '@games/interfaces/update-game-request.interface';
import { GetGamesService } from '@games/services/get-games.service';

@Injectable()
export class UpdateGameService {
  private readonly gamesService = inject(GamesService);
  private readonly getGamesService = inject(GetGamesService);
  private readonly mutation = mutationPerformer<Game>();

  error = this.mutation.error;
  isPending = this.mutation.isPending;

  execute(gameId: Game['gameId'], request: UpdateGameRequest) {
    return this.mutation
      .mutate(() => this.gamesService.updateGame(gameId, request))
      .pipe(tap({ next: () => this.getGamesService.reload() }));
  }
}
