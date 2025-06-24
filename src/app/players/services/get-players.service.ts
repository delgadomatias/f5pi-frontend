import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { BasePaginatedResourceService } from '@common/services/base-paginated-resource.service';
import { PlayersResponse } from '@players/interfaces/responses/players.response';
import { PlayersService } from '@players/services/players.service';

@Injectable({ providedIn: 'root' })
export class GetPlayersService extends BasePaginatedResourceService<PlayersResponse> {
  private readonly playersService = inject(PlayersService);
  players = computed(() => this.response()?.content || []);

  protected override getResourceStream(params: PaginatedRequest): Observable<PlayersResponse> {
    return this.playersService.getPlayers(params);
  }
}
