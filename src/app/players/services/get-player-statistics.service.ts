import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { Player } from '@players/interfaces/responses/player.interface';
import { PlayersService } from '@players/services/players.service';

@Injectable()
export class GetPlayerStatisticsService {
  private readonly playersService = inject(PlayersService);
  private readonly _selectedPlayerId = signal<Player['playerId'] | undefined>(undefined);
  private readonly playerStatisticsResource = rxResource({
    params: () => ({ playerId: this._selectedPlayerId() }),
    stream: ({ params: { playerId } }) =>
      playerId ? this.playersService.getPlayerStatistics(playerId) : of(undefined),
  });

  error = computed(() => this.playerStatisticsResource.error());
  isLoading = computed(() => this.playerStatisticsResource.isLoading());
  playerStatistics = computed(() => this.playerStatisticsResource.value());
  selectedPlayerId = computed(() => this._selectedPlayerId());

  setSelectedPlayerId = (playerId: Player['playerId'] | undefined) => this._selectedPlayerId.set(playerId);
}
