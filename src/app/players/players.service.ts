import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { CreatePlayerRequest } from '@players/interfaces/create-player-request.interface';
import { Player } from '@players/interfaces/player.interface';
import { PlayersResponse } from '@players/interfaces/players.response';
import { UpdatePlayerRequest } from '@players/interfaces/update-player-request.interface';
import { UploadPlayerImageRequest } from '@players/interfaces/upload-player-image-request.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getPlayers(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<PlayersResponse>(`http://localhost:8080/api/v1/users/${userId}/players`, {
      params: { ...params },
    });
  }

  createPlayer(createPlayerRequest: CreatePlayerRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Player>(`http://localhost:8080/api/v1/players`, {
      ...createPlayerRequest,
      userId,
    });
  }

  uploadPlayerImage(uploadPlayerImageRequest: UploadPlayerImageRequest) {
    const { playerId, image } = uploadPlayerImageRequest;
    const formData = new FormData();
    formData.append('multiPartFile', image);
    return this.http.post(`http://localhost:8080/api/v1/players/${playerId}/image`, formData);
  }

  updatePlayer(playerId: Player['playerId'], updatePlayerRequest: UpdatePlayerRequest) {
    return this.http.patch<Player>(`http://localhost:8080/api/v1/players/${playerId}`, updatePlayerRequest);
  }

  deletePlayer(playerId: Player['playerId']) {
    return this.http.delete(`http://localhost:8080/api/v1/players/${playerId}`);
  }
}
