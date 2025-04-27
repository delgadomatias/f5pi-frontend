import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { EditGameComponent } from '@games/components/edit-game/edit-game.component';
import { GameDetailComponent } from '@games/components/game-detail/game-detail.component';
import { NewGameDialogComponent } from '@games/components/new-game-dialog/new-game-dialog.component';
import { Game } from '@games/interfaces/game.interface';
import { injectDeleteGameMutation } from '@games/queries/inject-delete-game-mutation';
import { injectGetGamesQuery } from '@games/queries/inject-get-games-query';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    DatePipe,
    GenericWidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TableActionsComponent,
  ],
  selector: 'f5pi-games-widget',
  styleUrl: './games-widget.component.scss',
  templateUrl: './games-widget.component.html',
})
export class GamesWidgetComponent {
  deleteGameMutation = injectDeleteGameMutation();
  getGamesQuery = injectGetGamesQuery();
  dialog = inject(MatDialog);

  openNewGameDialog() {
    this.dialog.open(NewGameDialogComponent);
  }

  openGameDetailDialog(gameId: Game['gameId']) {
    this.dialog.open(GameDetailComponent, {
      data: { gameId },
    });
  }

  openEditGameDialog(game: Game) {
    this.dialog.open(EditGameComponent, {
      data: { game },
    });
  }

  handleDeleteGame(gameId: Game['gameId']) {
    this.deleteGameMutation.mutate(gameId);
  }

  onPageChangeEvent(event: PageEvent) {
    const { pageIndex } = event;
    this.getGamesQuery.setPageNumber(pageIndex);
  }
}
