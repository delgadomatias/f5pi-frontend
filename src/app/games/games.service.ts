import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/auth.service';
import { GamesResponse } from '@games/interfaces/games-response.interface';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getGames() {
    const userId = this.authService.getUserId();
    return this.http.get<GamesResponse>(`http://localhost:8080/api/v1/users/${userId}/games`);
  }
}
