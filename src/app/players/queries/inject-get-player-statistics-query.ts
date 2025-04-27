import { inject, signal } from "@angular/core";
import { injectQuery } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { Player } from "@players/interfaces/player.interface";
import { GET_PLAYER_STATISTICS_KEY } from "@players/players.constants";
import { PlayersService } from "@players/players.service";

export function injectGetPlayerStatisticsQuery() {
  const playersService = inject(PlayersService);
  const playerId = signal<Player['playerId'] | null>(null);

  return {
    playerId,
    query: injectQuery(() => ({
      queryFn: () => lastValueFrom(playersService.getPlayerStatistics(playerId()!)),
      queryKey: [GET_PLAYER_STATISTICS_KEY, playerId()],
      enabled: !!playerId(),
    })),
  };
}