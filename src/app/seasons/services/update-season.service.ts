import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { GetGamesService } from '@games/services/get-games.service';
import { UpdateSeasonRequest } from '@seasons/interfaces/requests/update-season-request.interface';
import { Season } from '@seasons/interfaces/responses/season.interface';
import { GetSeasonsService } from '@seasons/services/get-seasons.service';
import { SeasonsService } from '@seasons/services/seasons.service';

@Injectable()
export class UpdateSeasonService {
  private readonly seasonsService = inject(SeasonsService);
  private readonly getSeasonsService = inject(GetSeasonsService);
  private readonly getGamesService = inject(GetGamesService);
  private readonly mutation = mutationPerformer<Season>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(updateSeasonRequest: UpdateSeasonRequest) {
    return this.mutation
      .mutate(() => this.seasonsService.updateSeason(updateSeasonRequest))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getSeasonsService.reload();
    this.getGamesService.reload();
  }
}
