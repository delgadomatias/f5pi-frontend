import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/auth.service';
import { PlayersResponse } from '@players/interfaces/players.response';
import { delay } from 'rxjs';
import { CreatePlayerRequest } from './interfaces/create-player-request.interface';
import { Player } from './interfaces/player.interface';
import { UploadPlayerImageRequest } from './interfaces/upload-player-image-request.interface';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  getPlayers() {
    const userId = this.authService.getUserId();
    return this.http.get<PlayersResponse>(`http://localhost:8080/api/v1/users/${userId}/players`);
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
    return this.http.post(`http://localhost:8080/api/v1/players/${playerId}/image`, formData).pipe(delay(5000));
  }
}
