import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { injectMutation, injectQuery, keepPreviousData, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, Observable } from 'rxjs';

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

  createSeasonMutation = injectMutation(() => ({
    mutationFn: (request: CreateSeasonRequest) => lastValueFrom(this.createSeason(request)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  deleteSeasonMutation = injectMutation(() => ({
    mutationFn: (seasonId: Season['id']) => lastValueFrom(this.deleteSeason(seasonId)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  updateSeasonMutation = injectMutation(() => ({
    mutationFn: (request: UpdateSeasonRequest) => lastValueFrom(this.updateSeason(request)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  createGetSeasonsQuery() {
    const pageNumber = signal<number>(0);

    return {
      pageNumber,
      query: injectQuery(() => ({
        placeholderData: keepPreviousData,
        queryFn: () => lastValueFrom(this.getSeasons({ pageNumber: pageNumber() })),
        queryKey: [GET_SEASONS_KEY, pageNumber()],
        staleTime: Infinity,
      })),
    };
  }

  private getSeasons(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS): Observable<SeasonsResponse> {
    const userId = this.authService.getUserId();
    return this.http.get<SeasonsResponse>(`${environment.apiUrl}/api/v1/users/${userId}/seasons`, {
      params: { ...params },
    });
  }

  private createSeason(createSeasonRequest: CreateSeasonRequest) {
    const userId = this.authService.getUserId();
    return this.http.post(`${this.baseUrl}`, {
      ...createSeasonRequest,
      userId,
    });
  }

  private deleteSeason(seasonId: Season['id']) {
    return this.http.delete(`${this.baseUrl}/${seasonId}`);
  }

  private updateSeason(updatedSeason: UpdateSeasonRequest) {
    const { seasonId, ...rest } = updatedSeason;
    return this.http.patch(`${this.baseUrl}/${seasonId}`, rest);
  }

  private async handleOnSuccessMutation() {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: [GET_SEASONS_KEY] }),
      this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] })
    ])
  }
}
