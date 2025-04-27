import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { environment } from '@environments/environment';
import { GET_GAMES_KEY } from '@games/games.constants';
import { CreateSeasonRequest } from '@seasons/interfaces/create-season-request.interface';
import { Season } from '@seasons/interfaces/season.interface';
import { SeasonsResponse } from '@seasons/interfaces/seasons-response.interface';
import { UpdateSeasonRequest } from '@seasons/interfaces/update-season-request.interface';
import { GET_SEASONS_KEY } from '@seasons/seasons.constants';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/seasons`;
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getSeasons(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<SeasonsResponse>(`${environment.apiUrl}/api/v1/users/${userId}/seasons`, {
      params: { ...params, pageSize: 20 },
    });
  }

  createSeason(createSeasonRequest: CreateSeasonRequest) {
    const userId = this.authService.getUserId();
    return this.http.post(`${this.baseUrl}`, {
      ...createSeasonRequest,
      userId,
    });
  }

  deleteSeason(seasonId: Season['id']) {
    return this.http.delete(`${this.baseUrl}/${seasonId}`);
  }

  updateSeason(updatedSeason: UpdateSeasonRequest) {
    const { seasonId, ...rest } = updatedSeason;
    return this.http.patch(`${this.baseUrl}/${seasonId}`, rest);
  }

  async handleOnSuccessMutation() {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: [GET_SEASONS_KEY] }),
      this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] })
    ])
  }
}
