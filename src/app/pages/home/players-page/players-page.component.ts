import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { QueryParamsService } from '@common/services/query-params.service';
import { PlayersWidgetComponent } from "@players/components/players-widget/players-widget.component";
import { Player } from '@players/interfaces/player.interface';
import { Statistics } from '@players/interfaces/statistics.interface';
import { PlayersService } from '@players/players.service';

interface StatisticBlock {
  key: keyof Statistics;
  label: string;
  cssClass: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatPaginatorModule, NgClass, PlayersWidgetComponent, CurrencyPipe, MatProgressSpinnerModule],
  selector: 'f5pi-players-page',
  styleUrl: './players-page.component.scss',
  templateUrl: './players-page.component.html',
})
export class PlayersPageComponent implements OnInit {
  private readonly playersService = inject(PlayersService);
  private readonly queryParams = inject(QueryParamsService);

  readonly getStatisticsQuery = this.playersService.createGetPlayerStatisticsQuery();
  readonly playerStatistics = computed(() => this.getStatisticsQuery.query.data());

  readonly selectedPlayerId = signal<string | null>(null);

  readonly statisticBlocks: readonly StatisticBlock[] = [
    { key: 'wins', label: 'Wins', cssClass: 'wins' },
    { key: 'losses', label: 'Losses', cssClass: 'losses' },
    { key: 'draws', label: 'Draws', cssClass: 'draws' },
    { key: 'games', label: 'Games', cssClass: 'games' },
    { key: 'moneySpent', label: 'Money spent', cssClass: 'money-spent' },
    { key: 'goals', label: 'Goals', cssClass: 'goals' },
    { key: 'ownGoals', label: 'Own goals', cssClass: 'own-goals' },
  ];

  ngOnInit(): void {
    const params = this.queryParams.queryParams();
    if (params?.['selected']) {
      this.getStatisticsQuery.playerId.set(params['selected']);
      this.selectedPlayerId.set(params['selected']);
    }
  }

  handlePlayerSelection(player: Player): void {
    const currentSelectedId = this.selectedPlayerId();
    const isSame = currentSelectedId === player.playerId;
    const newSelectedId = isSame ? null : player.playerId;

    this.selectedPlayerId.set(newSelectedId);
    this.getStatisticsQuery.playerId.set(newSelectedId);

    if (newSelectedId) {
      this.queryParams.pushQueryParams({ selected: newSelectedId });
    } else {
      this.queryParams.clearQueryParams();
    }
  }
}