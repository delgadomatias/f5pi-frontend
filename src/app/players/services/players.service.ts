import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/services/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { createPaginationParams } from '@common/utils/create-pagination-params';
import { environment } from '@environments/environment';
import { CreatePlayerRequest } from '@players/interfaces/requests/create-player-request.interface';
import { UpdatePlayerRequest } from '@players/interfaces/requests/update-player-request.interface';
import { UploadPlayerImageRequest } from '@players/interfaces/requests/upload-player-image-request.interface';
import { Player } from '@players/interfaces/responses/player.interface';
import { PlayersResponse } from '@players/interfaces/responses/players.response';
import { Statistics } from '@players/interfaces/responses/statistics.interface';

@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly BASE_URL = `${environment.apiUrl}/api/v1/players`;
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  getPlayers(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    const { pageNumber, pageSize } = params;
    return this.http.get<PlayersResponse>(`${environment.apiUrl}/api/v1/users/${userId}/players`, {
      params: createPaginationParams(
        pageNumber ?? DEFAULT_PAGINATION_PARAMS.pageNumber,
        pageSize ?? DEFAULT_PAGINATION_PARAMS.pageSize
      ),
    });
  }

  createPlayer(createPlayerRequest: CreatePlayerRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Player>(this.BASE_URL, {
      ...createPlayerRequest,
      userId,
    });
  }

  uploadPlayerImage(uploadPlayerImageRequest: UploadPlayerImageRequest) {
    const { playerId, image } = uploadPlayerImageRequest;
    const formData = new FormData();
    formData.append('multiPartFile', image);
    return this.http.post<void>(`${this.BASE_URL}/${playerId}/image`, formData);
  }

  updatePlayer(updatePlayerRequest: UpdatePlayerRequest) {
    const { playerId, ...rest } = updatePlayerRequest;
    return this.http.patch<Player>(`${this.BASE_URL}/${playerId}`, rest);
  }

  deletePlayer(playerId: Player['playerId']) {
    return this.http.delete<void>(`${this.BASE_URL}/${playerId}`);
  }

  getPlayerStatistics(playerId: Player['playerId']) {
    return this.http.get<Statistics>(`${this.BASE_URL}/${playerId}/statistics`);
  }
}
