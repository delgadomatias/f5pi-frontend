import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { delay } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { environment } from '@environments/environment';
import { CreatePlayerRequest } from '@players/interfaces/create-player-request.interface';
import { Player } from '@players/interfaces/player.interface';
import { PlayersResponse } from '@players/interfaces/players.response';
import { Statistics } from '@players/interfaces/statistics.interface';
import { UpdatePlayerRequest } from '@players/interfaces/update-player-request.interface';
import { UploadPlayerImageRequest } from '@players/interfaces/upload-player-image-request.interface';
import { GET_PLAYERS_KEY } from '@players/players.constants';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/players`;
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getPlayers(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<PlayersResponse>(`${environment.apiUrl}/api/v1/users/${userId}/players`, {
      params: { ...params, pageSize: 20 },
    })
  }

  createPlayer(createPlayerRequest: CreatePlayerRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Player>(this.baseUrl, {
      ...createPlayerRequest,
      userId,
    });
  }

  uploadPlayerImage(uploadPlayerImageRequest: UploadPlayerImageRequest) {
    const { playerId, image } = uploadPlayerImageRequest;
    const formData = new FormData();
    formData.append('multiPartFile', image);
    return this.http.post(`${this.baseUrl}/${playerId}/image`, formData);
  }

  updatePlayer(updatePlayerRequest: UpdatePlayerRequest) {
    const { playerId, ...rest } = updatePlayerRequest;
    return this.http.patch<Player>(`${this.baseUrl}/${playerId}`, rest);
  }

  deletePlayer(playerId: Player['playerId']) {
    return this.http.delete(`${this.baseUrl}/${playerId}`);
  }

  getPlayerStatistics(playerId: Player['playerId']) {
    return this.http.get<Statistics>(`${this.baseUrl}/${playerId}/statistics`).pipe(delay(5000))
  }

  handleOnSuccessMutation() {
    this.queryClient.invalidateQueries({ queryKey: [GET_PLAYERS_KEY] });
  }
}
