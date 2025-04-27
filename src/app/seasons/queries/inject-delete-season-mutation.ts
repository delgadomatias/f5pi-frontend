import { inject } from "@angular/core";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { Season } from "@seasons/interfaces/season.interface";
import { GET_SEASONS_KEY } from "@seasons/seasons.constants";
import { SeasonsService } from "@seasons/seasons.service";

export function injectDeleteSeasonMutation() {
  const queryClient = inject(QueryClient);
  const seasonsService = inject(SeasonsService);
  return injectMutation(() => ({
    mutationFn: (seasonId: Season['id']) => lastValueFrom(seasonsService.deleteSeason(seasonId)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_SEASONS_KEY] })
  }));
}
