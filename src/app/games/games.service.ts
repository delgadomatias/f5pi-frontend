import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom, switchMap } from 'rxjs';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { GET_GAMES_KEY } from '@games/games.constants';
import { CreateGameRequest } from '@games/interfaces/create-game-request.interface';
import { GamesResponse } from '@games/interfaces/games-response.interface';
import { CreateGameDetailRequest } from './interfaces/create-game-detail-request.interface';
import { GameDetailResponse } from './interfaces/game-detail-response.interface';
import { Game } from './interfaces/game.interface';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  createGameMutation = injectMutation(() => ({
    mutationFn: ({ game, detail }: { game: CreateGameRequest; detail: CreateGameDetailRequest }) =>
      lastValueFrom(this.createGameWithDetail(game, detail)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  createGetGamesQuery() {
    const pageNumber = signal<number>(0);

    return {
      pageNumber,
      query: injectQuery(() => ({
        queryFn: () => lastValueFrom(this.getGames({ pageNumber: pageNumber() })),
        queryKey: [GET_GAMES_KEY, pageNumber()],
        staleTime: Infinity,
      })),
    };
  }

  getGameDetailQuery(gameId: Game['gameId']) {
    return injectQuery(() => ({
      queryFn: () => lastValueFrom(this.getGameDetail(gameId)),
      queryKey: [GET_GAMES_KEY, gameId],
      staleTime: Infinity,
    }));
  }

  private getGames(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<GamesResponse>(`http://localhost:8080/api/v1/users/${userId}/games`, {
      params: { ...params },
    });
  }

  private getGameDetail(gameId: Game['gameId']) {
    return this.http.get<GameDetailResponse>(`http://localhost:8080/api/v1/games/${gameId}/detail`);
  }

  private createGameWithDetail(createGameRequest: CreateGameRequest, createGameDetailRequest: CreateGameDetailRequest) {
    return this.createGame(createGameRequest).pipe(
      switchMap((game) => {
        const { gameId } = game;
        return this.createGameDetail(gameId, createGameDetailRequest);
      })
    );
  }

  private createGame(request: CreateGameRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Game>(`http://localhost:8080/api/v1/games`, {
      ...request,
      userId,
    });
  }

  private createGameDetail(gameId: Game['gameId'], request: CreateGameDetailRequest) {
    return this.http.post(`http://localhost:8080/api/v1/games/${gameId}/detail`, request);
  }

  private handleOnSuccessMutation() {
    this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] });
  }
}
