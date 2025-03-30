import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { CreateSeasonRequest } from '@seasons/interfaces/create-season-request.interface';
import { Season } from '@seasons/interfaces/season.interface';
import { SeasonsResponse } from '@seasons/interfaces/seasons-response.interface';
import { UpdateSeasonRequest } from '@seasons/interfaces/update-season-request.interface';

interface PaginationRequest {
  pageNumber: number;
}

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getSeasons(params?: PaginationRequest): Observable<SeasonsResponse> {
    const pageNumber = params?.pageNumber ?? 0;
    const userId = this.authService.getUserId();
    return this.http.get<SeasonsResponse>(`http://localhost:8080/api/v1/users/${userId}/seasons`, {
      params: { pageNumber },
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
