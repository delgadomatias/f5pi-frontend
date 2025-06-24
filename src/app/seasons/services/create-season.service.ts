import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { CreateSeasonRequest } from '@seasons/interfaces/requests/create-season-request.interface';
import { Season } from '@seasons/interfaces/responses/season.interface';
import { INFINITE_SEASONS_QUERY_KEY } from '@seasons/queries/inject-get-infinite-seasons-query';
import { GetSeasonsService } from '@seasons/services/get-seasons.service';
import { SeasonsService } from '@seasons/services/seasons.service';
import { QueryClient } from '@tanstack/angular-query-experimental';

@Injectable()
export class CreateSeasonService {
  private readonly seasonsService = inject(SeasonsService);
  private readonly getSeasonsService = inject(GetSeasonsService);
  private readonly queryClient = inject(QueryClient);
  private readonly mutation = mutationPerformer<Season>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(createSeasonRequest: CreateSeasonRequest) {
    return this.mutation
      .mutate(() => this.seasonsService.createSeason(createSeasonRequest))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getSeasonsService.reload();
    this.queryClient.invalidateQueries({ queryKey: [INFINITE_SEASONS_QUERY_KEY] });
  }
}
