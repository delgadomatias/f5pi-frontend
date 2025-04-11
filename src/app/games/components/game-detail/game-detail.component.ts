import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, JsonPipe, MatChipsModule],
  selector: 'f5pi-game-detail',
  styleUrl: './game-detail.component.scss',
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent {
  gamesService = inject(GamesService);
  gameId = inject(MAT_DIALOG_DATA).gameId as Game['gameId'];
  getGameDetailQuery = this.gamesService.getGameDetailQuery(this.gameId);

  getPlayersForFirstTeam() {
    const teams = this.getGameDetailQuery.data()!.teams;
    return teams[0].members;
  }

  getPlayersForSecondTeam() {
    const teams = this.getGameDetailQuery.data()!.teams;
    return teams[1].members;
  }
}
