import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { switchMap } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { GET_GAMES_KEY } from '@games/games.constants';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { GamesResponse } from '@games/interfaces/games-response.interface';
import { GET_PLAYER_STATISTICS_KEY } from '@players/players.constants';
import { CreateGameDetailRequest } from './interfaces/create-game-detail-request.interface';
import { GameDetailResponse } from './interfaces/game-detail-response.interface';
import { Game } from './interfaces/game.interface';
import { UpdateGameRequest } from './interfaces/update-game-request.interface';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getGames(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<GamesResponse>(`http://localhost:8080/api/v1/users/${userId}/games`, {
      params: { ...params, pageSize: 20 },
    });
  }

  getGameDetail(gameId: Game['gameId']) {
    return this.http.get<GameDetailResponse>(`http://localhost:8080/api/v1/games/${gameId}/detail`);
  }

  createGameWithDetail(createGameRequest: CreateGameRequest, createGameDetailRequest: CreateGameDetailRequest) {
    return this.createGame(createGameRequest).pipe(
      switchMap((game) => {
        const { gameId } = game;
        return this.createGameDetail(gameId, createGameDetailRequest);
      })
    );
  }

  createGame(request: CreateGameRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Game>(`http://localhost:8080/api/v1/games`, {
      ...request,
      userId,
    });
  }

  createGameDetail(gameId: Game['gameId'], request: CreateGameDetailRequest) {
    return this.http.post(`http://localhost:8080/api/v1/games/${gameId}/detail`, request);
  }

  deleteGame(gameId: Game['gameId']) {
    return this.http.delete(`http://localhost:8080/api/v1/games/${gameId}`);
  }

  updateGame(gameId: Game['gameId'], request: UpdateGameRequest) {
    return this.http.patch<Game>(`http://localhost:8080/api/v1/games/${gameId}`, request);
  }

  async handleOnSuccessMutation() {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] }),
      this.queryClient.invalidateQueries({ queryKey: [GET_PLAYER_STATISTICS_KEY] })
    ])
  }
}
