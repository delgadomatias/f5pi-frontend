import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { CreatePlayerRequest } from "@players/interfaces/create-player-request.interface";
import { PlayersService } from "@players/players.service";

export function injectCreatePlayerMutation() {
  const playersService = inject(PlayersService);
  return injectMutation(() => ({
    mutationFn: async (request: CreatePlayerRequest & { image: File | null }) => {
      const { image, name } = request;
      const player = await lastValueFrom(playersService.createPlayer({ name }));

      if (image) {
        const form = new FormData();
        form.append('multiPartFile', image);
        await lastValueFrom(playersService.uploadPlayerImage({ image, playerId: player.playerId }));
      }

      return player;
    },
    onSuccess: () => playersService.handleOnSuccessMutation()
  }))
}