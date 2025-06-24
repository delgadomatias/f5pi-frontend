import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { Player } from '@players/interfaces/responses/player.interface';
import { GetPlayersService } from '@players/services/get-players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTableModule, TableActionsComponent, NgClass, MatProgressSpinnerModule, MatPaginatorModule],
  selector: 'f5pi-players-list',
  styleUrl: './players-list.component.scss',
  templateUrl: './players-list.component.html',
})
export class PlayersListComponent {
  playerSelected = output<Player | null>();
  selectedPlayer = input<Player | null>();
  getPlayersService = inject(GetPlayersService);

  handlePageChange(event: PageEvent) {
    this.getPlayersService.setPageNumber(event.pageIndex);
  }
}
