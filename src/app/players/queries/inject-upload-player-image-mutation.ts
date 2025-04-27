import { inject } from '@angular/core';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

import { UploadPlayerImageRequest } from '@players/interfaces/upload-player-image-request.interface';
import { PlayersService } from '@players/players.service';

export function injectUploadPlayerImageMutation() {
  const playersService = inject(PlayersService);
  return injectMutation(() => ({
    mutationFn: (request: UploadPlayerImageRequest) => lastValueFrom(playersService.uploadPlayerImage(request)),
    onSuccess: () => playersService.handleOnSuccessMutation(),
  }));
}