import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { UpdateSeasonRequest } from "@seasons/interfaces/update-season-request.interface";
import { SeasonsService } from "@seasons/seasons.service";

export function injectUpdateSeasonMutation() {
  const seasonsService = inject(SeasonsService);
  return injectMutation(() => ({
    mutationFn: (request: UpdateSeasonRequest) => lastValueFrom(seasonsService.updateSeason(request)),
    onSuccess: () => seasonsService.handleOnSuccessMutation(),
  }));
}
