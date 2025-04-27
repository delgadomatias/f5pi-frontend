import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';
import { injectGetGameDetailQuery } from '@games/queries/inject-get-game-detail-query';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, MatChipsModule, NgClass, MatProgressSpinnerModule],
  selector: 'f5pi-game-detail',
  styleUrl: './game-detail.component.scss',
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent {
  gamesService = inject(GamesService);
  gameId = inject(MAT_DIALOG_DATA).gameId as Game['gameId'];
  getGameDetailQuery = injectGetGameDetailQuery(this.gameId);

  getPlayersForFirstTeam() {
    const teams = this.getGameDetailQuery.data()!.teams;
    return teams[0].members;
  }

  getPlayersForSecondTeam() {
    const teams = this.getGameDetailQuery.data()!.teams;
    return teams[1].members;
  }

  getResultForFirstTeam() {
    const result = this.getGameDetailQuery.data()!.teams[0].result;
    return result === "WIN" ? "Winner" : result === "LOSS" ? "Loser" : "Draw";
  }

  getResultForSecondTeam() {
    const result = this.getGameDetailQuery.data()!.teams[1].result;
    return result === "WIN" ? "Winner" : result === "LOSS" ? "Loser" : "Draw";
  }

}
