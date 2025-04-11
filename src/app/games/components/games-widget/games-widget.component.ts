import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { GameDetailComponent } from '@games/components/game-detail/game-detail.component';
import { NewGameDialogComponent } from '@games/components/new-game-dialog/new-game-dialog.component';
import { GamesService } from '@games/games.service';
import { Game } from '@games/interfaces/game.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    GenericWidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TableActionsComponent,
    MatPaginatorModule,
  ],
  selector: 'f5pi-games-widget',
  styleUrl: './games-widget.component.css',
  templateUrl: './games-widget.component.html',
})
export class GamesWidgetComponent {
  gamesService = inject(GamesService);
  getGamesQuery = this.gamesService.createGetGamesQuery();
  dialog = inject(MatDialog);

  openNewGameDialog() {
    const dialogRef = this.dialog.open(NewGameDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  openGameDetailDialog(gameId: Game['gameId']) {
    const dialogRef = this.dialog.open(GameDetailComponent, {
      data: { gameId },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  onPageChangeEvent(event: PageEvent) {
    const { pageIndex } = event;
    this.getGamesQuery.pageNumber.set(pageIndex);
  }
}
