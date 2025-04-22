import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, of, switchMap } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { environment } from '@environments/environment';
import { CreatePlayerRequest } from '@players/interfaces/create-player-request.interface';
import { Player } from '@players/interfaces/player.interface';
import { PlayersResponse } from '@players/interfaces/players.response';
import { UpdatePlayerRequest } from '@players/interfaces/update-player-request.interface';
import { UploadPlayerImageRequest } from '@players/interfaces/upload-player-image-request.interface';
import { GET_PLAYER_STATISTICS_KEY, GET_PLAYERS_KEY } from '@players/players.constants';
import { Statistics } from './interfaces/statistics.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/players`;
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  createPlayerWithImageMutation = injectMutation(() => ({
    mutationFn: (request: CreatePlayerRequest & { image: File }) => lastValueFrom(this.createPlayerWithImage(request)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  deletePlayerMutation = injectMutation(() => ({
    mutationFn: (playerId: Player['playerId']) => lastValueFrom(this.deletePlayer(playerId)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  updatePlayerMutation = injectMutation(() => ({
    mutationFn: (request: UpdatePlayerRequest) => lastValueFrom(this.updatePlayer(request)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  uploadPlayerImageMutation = injectMutation(() => ({
    mutationFn: (request: UploadPlayerImageRequest) => lastValueFrom(this.uploadPlayerImage(request)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  createGetPlayerStatisticsQuery() {
    const playerId = signal<Player['playerId'] | null>(null);
    return {
      playerId,
      query: injectQuery(() => ({
        queryFn: () => lastValueFrom(this.getPlayerStatistics(playerId()!)),
        queryKey: [GET_PLAYER_STATISTICS_KEY, playerId()],
        staleTime: Infinity,
        enabled: !!playerId(),
      })),
    };
  }

  createGetPlayersQuery() {
    const pageNumber = signal<number>(0);

    return {
      pageNumber,
      query: injectQuery(() => ({
        queryFn: () => lastValueFrom(this.getPlayers({ pageNumber: pageNumber() })),
        queryKey: [GET_PLAYERS_KEY, pageNumber()],
        staleTime: Infinity,
      })),
    };
  }

  private getPlayers(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<PlayersResponse>(`${environment.apiUrl}/api/v1/users/${userId}/players`, {
      params: { ...params, pageSize: 11 },
    })
  }

  private createPlayer(createPlayerRequest: CreatePlayerRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Player>(this.baseUrl, {
      ...createPlayerRequest,
      userId,
    });
  }

  private uploadPlayerImage(uploadPlayerImageRequest: UploadPlayerImageRequest) {
    const { playerId, image } = uploadPlayerImageRequest;
    const formData = new FormData();
    formData.append('multiPartFile', image);
    return this.http.post(`${this.baseUrl}/${playerId}/image`, formData);
  }

  private createPlayerWithImage(request: CreatePlayerRequest & { image: File }) {
    const { image, ...playerData } = request;

    return this.createPlayer(playerData).pipe(
      switchMap((createdPlayer) => {
        if (image) {
          return this.uploadPlayerImage({
            playerId: createdPlayer.playerId,
            image,
          }).pipe(switchMap(() => of(createdPlayer)));
        }
        return of(createdPlayer);
      })
    );
  }

  private updatePlayer(updatePlayerRequest: UpdatePlayerRequest) {
    const { playerId, ...rest } = updatePlayerRequest;
    return this.http.patch<Player>(`${this.baseUrl}/${playerId}`, rest);
  }

  private deletePlayer(playerId: Player['playerId']) {
    return this.http.delete(`${this.baseUrl}/${playerId}`);
  }

  private getPlayerStatistics(playerId: Player['playerId']) {
    return this.http.get<Statistics>(`${this.baseUrl}/${playerId}/statistics`);
  }

  private handleOnSuccessMutation() {
    this.queryClient.invalidateQueries({ queryKey: [GET_PLAYERS_KEY] });
  }
}
