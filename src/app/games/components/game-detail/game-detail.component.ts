import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { Game } from '@games/interfaces/game.interface';
import { GetGameDetailService } from '@games/services/get-game-detail.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, MatChipsModule, NgClass, MatProgressSpinnerModule],
  selector: 'f5pi-game-detail',
  styleUrl: './game-detail.component.scss',
  templateUrl: './game-detail.component.html',
})
export class GameDetailComponent implements OnInit {
  private readonly gameId = inject(MAT_DIALOG_DATA).gameId as Game['gameId'];
  readonly getGameDetailService = inject(GetGameDetailService);
  gameDetails = this.getGameDetailService.gameDetail;

  ngOnInit(): void {
    console.log('hola?', this.gameId);
    this.getGameDetailService.setGameId(this.gameId);
  }

  getPlayersForFirstTeam() {
    const teams = this.gameDetails()!.teams;
    return teams[0].members;
  }

  getPlayersForSecondTeam() {
    const teams = this.gameDetails()!.teams;
    return teams[1].members;
  }

  getResultForFirstTeam() {
    const result = this.getGameDetailService.gameDetail()!.teams[0].result;
    return result === 'WIN' ? 'Winner' : result === 'LOSS' ? 'Loser' : 'Draw';
  }

  getResultForSecondTeam() {
    const result = this.getGameDetailService.gameDetail()!.teams[1].result;
    return result === 'WIN' ? 'Winner' : result === 'LOSS' ? 'Loser' : 'Draw';
  }
}
