import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { BasePaginatedResourceService } from '@common/services/base-paginated-resource.service';
import { GamesService } from '@games/games.service';
import { GamesResponse } from '@games/interfaces/games-response.interface';

@Injectable({ providedIn: 'root' })
export class GetGamesService extends BasePaginatedResourceService<GamesResponse> {
  private readonly gamesService = inject(GamesService);
  games = computed(() => this.response()?.content || []);

  protected override getResourceStream(params: PaginatedRequest): Observable<GamesResponse> {
    return this.gamesService.getGames(params);
  }
}
