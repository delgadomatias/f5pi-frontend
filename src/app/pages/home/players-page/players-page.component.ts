import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';

import { PlayersListComponent } from "@players/components/players-list/players-list.component";
import { Player } from '@players/interfaces/player.interface';
import { PlayersService } from '@players/players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PlayersListComponent, MatPaginatorModule],
  selector: 'f5pi-players-page',
  styleUrl: './players-page.component.css',
  templateUrl: './players-page.component.html',
})
export class PlayersPageComponent {
  selectedPlayer = signal<Player | null>(null);
  playersService = inject(PlayersService)
  getStatisticsQuery = this.playersService.createGetPlayerStatisticsQuery();

  handlePlayerSelection(player: Player | null) {
    if (this.selectedPlayer() === player) {
      this.selectedPlayer.set(null);
      this.getStatisticsQuery.playerId.set(null);
      return;
    }

    this.selectedPlayer.set(player);
    this.getStatisticsQuery.playerId.set(player?.playerId || null);
  }

  getPlayerStatistics() {
    return this.getStatisticsQuery.query.data();
  }
}
