import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';

@Injectable({ providedIn: 'root' })
export class GetGameDetailService {
  private readonly gamesService = inject(GamesService);
  private readonly _gameId = signal<Game['gameId'] | undefined>(undefined);
  private readonly gameDetailResource = rxResource({
    params: () => ({ gameId: this._gameId() }),
    stream: ({ params: { gameId } }) => (gameId ? this.gamesService.getGameDetail(gameId) : of(undefined)),
  });

  gameId = computed(() => this._gameId());
  gameDetail = computed(() => this.gameDetailResource.value());
  isLoading = computed(() => this.gameDetailResource.isLoading());
  error = computed(() => this.gameDetailResource.error());

  setGameId = (gameId: Game['gameId']) => this._gameId.set(gameId);
  getGameId = () => this._gameId();
}
