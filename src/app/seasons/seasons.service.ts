import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { CreateSeasonRequest } from '@seasons/interfaces/create-season-request.interface';
import { Season } from '@seasons/interfaces/season.interface';
import { SeasonsResponse } from '@seasons/interfaces/seasons-response.interface';
import { UpdateSeasonRequest } from '@seasons/interfaces/update-season-request.interface';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getSeasons(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS): Observable<SeasonsResponse> {
    const userId = this.authService.getUserId();
    return this.http.get<SeasonsResponse>(`http://localhost:8080/api/v1/users/${userId}/seasons`, {
      params: { ...params },
    });
  }

  createSeason(createSeasonRequest: CreateSeasonRequest) {
    const userId = this.authService.getUserId();
    return this.http.post(`http://localhost:8080/api/v1/seasons`, {
      ...createSeasonRequest,
      userId,
    });
  }

  deleteSeason(seasonId: Season['id']) {
    return this.http.delete(`http://localhost:8080/api/v1/seasons/${seasonId}`);
  }

  updateSeason(seasonId: Season['id'], updatedSeason: UpdateSeasonRequest) {
    return this.http.patch(`http://localhost:8080/api/v1/seasons/${seasonId}`, updatedSeason);
  }
}
