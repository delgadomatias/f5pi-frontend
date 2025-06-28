import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { createPaginationParams } from '@common/utils/create-pagination-params';
import { environment } from '@environments/environment';
import { CreateSeasonRequest } from '@seasons/interfaces/requests/create-season-request.interface';
import { UpdateSeasonRequest } from '@seasons/interfaces/requests/update-season-request.interface';
import { Season } from '@seasons/interfaces/responses/season.interface';
import { SeasonsResponse } from '@seasons/interfaces/responses/seasons-response.interface';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private readonly authService = inject(AuthService);
  private readonly BASE_URL = `${environment.API_URL}/api/v1/seasons`;
  private readonly http = inject(HttpClient);

  getSeasons(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    const { pageNumber, pageSize } = params;
    return this.http.get<SeasonsResponse>(`${environment.API_URL}/api/v1/users/${userId}/seasons`, {
      params: createPaginationParams(
        pageNumber ?? DEFAULT_PAGINATION_PARAMS.pageNumber,
        pageSize ?? DEFAULT_PAGINATION_PARAMS.pageSize
      ),
    });
  }

  createSeason(createSeasonRequest: CreateSeasonRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Season>(`${this.BASE_URL}`, {
      ...createSeasonRequest,
      userId,
    });
  }

  deleteSeason(seasonId: Season['id']) {
    return this.http.delete<void>(`${this.BASE_URL}/${seasonId}`);
  }

  updateSeason(updatedSeason: UpdateSeasonRequest) {
    const { seasonId, ...rest } = updatedSeason;
    return this.http.patch<Season>(`${this.BASE_URL}/${seasonId}`, rest);
  }
}
