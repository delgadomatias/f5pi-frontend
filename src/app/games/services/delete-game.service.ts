import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';
import { GetGamesService } from '@games/services/get-games.service';

@Injectable()
export class DeleteGameService {
  private readonly gamesService = inject(GamesService);
  private readonly getGamesService = inject(GetGamesService);
  private readonly mutation = mutationPerformer<void>();

  error = this.mutation.error;
  isPending = this.mutation.isPending;

  execute(gameId: Game['gameId']) {
    return this.mutation
      .mutate(() => this.gamesService.deleteGame(gameId))
      .pipe(tap({ next: () => this.getGamesService.reload() }));
  }
}
