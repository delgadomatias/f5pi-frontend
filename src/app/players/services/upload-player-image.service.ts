import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { UploadPlayerImageRequest } from '@players/interfaces/requests/upload-player-image-request.interface';
import { GetPlayersService } from '@players/services/get-players.service';
import { PlayersService } from '@players/services/players.service';

@Injectable()
export class UploadPlayerImageService {
  private readonly playersService = inject(PlayersService);
  private readonly getPlayersService = inject(GetPlayersService);
  private readonly mutation = mutationPerformer<void>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(request: UploadPlayerImageRequest) {
    return this.mutation
      .mutate(() => this.playersService.uploadPlayerImage(request))
      .pipe(tap({ next: () => this.getPlayersService.reload() }));
  }
}
