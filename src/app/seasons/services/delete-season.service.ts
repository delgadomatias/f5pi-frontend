import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { Season } from '@seasons/interfaces/responses/season.interface';
import { GetSeasonsService } from '@seasons/services/get-seasons.service';
import { SeasonsService } from '@seasons/services/seasons.service';

@Injectable()
export class DeleteSeasonService {
  private readonly seasonsService = inject(SeasonsService);
  private readonly getSeasonsService = inject(GetSeasonsService);
  private readonly mutation = mutationPerformer<void>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(seasonId: Season['id']) {
    return this.mutation
      .mutate(() => this.seasonsService.deleteSeason(seasonId))
      .pipe(tap({ next: () => this.getSeasonsService.reload() }));
  }
}
