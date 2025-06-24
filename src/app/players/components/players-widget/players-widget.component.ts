import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { EntityDialogService } from '@common/services/entity-dialog.service';
import { QueryParamsService } from '@common/services/query-params.service';
import { ThemeService } from '@common/services/theme.service';
import { EditPlayerComponent } from '@players/components/edit-player/edit-player.component';
import { NewPlayerDialogComponent } from '@players/components/new-player-dialog/new-player-dialog.component';
import { Player } from '@players/interfaces/responses/player.interface';
import { DEFAULT_AVATAR_URLS } from '@players/players.constants';
import { DeletePlayerService } from '@players/services/delete-player.service';
import { GetPlayersService } from '@players/services/get-players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericWidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    NgClass,
    TableActionsComponent,
  ],
  selector: 'f5pi-players-widget',
  styleUrl: './players-widget.component.scss',
  templateUrl: './players-widget.component.html',
  providers: [DeletePlayerService],
})
export class PlayersWidgetComponent implements OnInit {
  entityDialogService = inject(EntityDialogService);
  queryParamsService = inject(QueryParamsService);
  themeService = inject(ThemeService);
  allowSelection = input<boolean>(false);
  selectedPlayerId = input<string | null>();
  playerSelected = output<Player>();
  deletePlayerService = inject(DeletePlayerService);
  getPlayersService = inject(GetPlayersService);

  ngOnInit() {
    this.checkQueryParams();
  }

  openNewPlayerDialog() {
    this.entityDialogService.openNewEntityDialog(NewPlayerDialogComponent, { entity: 'player' }).subscribe();
  }

  openEditPlayerDialog(player: Player) {
    this.entityDialogService.openEditEntityDialog(EditPlayerComponent, { data: player }).subscribe();
  }

  handleDeletePlayer(player: Player) {
    this.deletePlayerService.execute(player.playerId).subscribe();
  }

  handlePageChange(event: PageEvent) {
    const { pageIndex } = event;
    this.getPlayersService.setPageNumber(pageIndex);
  }

  handleSelection(row: Player) {
    if (this.allowSelection()) {
      this.playerSelected.emit(row);
    }
  }

  private checkQueryParams() {
    const params = this.queryParamsService.queryParams();
    if (!params) return;
    if (params['entity'] === 'player' && params['action'] === 'new') this.openNewPlayerDialog();
  }

  DEFAULT_AVATAR_URLS = DEFAULT_AVATAR_URLS;
}
