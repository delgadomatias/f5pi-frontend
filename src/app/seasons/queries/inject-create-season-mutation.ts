import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { CreateSeasonRequest } from "@seasons/interfaces/create-season-request.interface";
import { SeasonsService } from "@seasons/seasons.service";

export function injectCreateSeasonMutation() {
  const seasonsService = inject(SeasonsService);
  return injectMutation(() => ({
    mutationFn: (request: CreateSeasonRequest) => lastValueFrom(seasonsService.createSeason(request)),
    onSuccess: () => seasonsService.handleOnSuccessMutation(),
  }));
}
