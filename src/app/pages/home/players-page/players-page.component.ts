import { CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Title } from '@angular/platform-browser';

import { QueryParamsService } from '@common/services/query-params.service';
import { PlayersWidgetComponent } from '@players/components/players-widget/players-widget.component';
import { Player } from '@players/interfaces/responses/player.interface';
import { Statistics } from '@players/interfaces/responses/statistics.interface';
import { GetPlayerStatisticsService } from '@players/services/get-player-statistics.service';

interface StatisticBlock {
  key: keyof Statistics;
  label: string;
  cssClass: string;
}

const statisticBlocks: readonly StatisticBlock[] = [
  { key: 'wins', label: 'Wins', cssClass: 'wins' },
  { key: 'losses', label: 'Losses', cssClass: 'losses' },
  { key: 'draws', label: 'Draws', cssClass: 'draws' },
  { key: 'games', label: 'Games', cssClass: 'games' },
  { key: 'moneySpent', label: 'Money spent', cssClass: 'money-spent' },
  { key: 'goals', label: 'Goals', cssClass: 'goals' },
  { key: 'ownGoals', label: 'Own goals', cssClass: 'own-goals' },
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgClass,
    PlayersWidgetComponent,
  ],
  selector: 'f5pi-players-page',
  styleUrl: './players-page.component.scss',
  templateUrl: './players-page.component.html',
  providers: [GetPlayerStatisticsService],
})
export class PlayersPageComponent implements OnInit {
  private readonly queryParams = inject(QueryParamsService);
  private readonly titleService = inject(Title);
  readonly getPlayerStatisticsService = inject(GetPlayerStatisticsService);
  selectedPlayerId = this.getPlayerStatisticsService.selectedPlayerId;

  constructor() {
    this.titleService.setTitle('Players — F5pi');
  }

  ngOnInit(): void {
    const params = this.queryParams.queryParams();
    const selectedPlayerId = params?.['selected'] ?? undefined;
    this.getPlayerStatisticsService.setSelectedPlayerId(selectedPlayerId);
  }

  handlePlayerSelection(player: Player): void {
    const isTheSamePlayer = this.selectedPlayerId() === player.playerId;
    if (isTheSamePlayer) {
      this.queryParams.removeQueryParams(['selected']);
      this.getPlayerStatisticsService.setSelectedPlayerId(undefined);
      return;
    }

    this.getPlayerStatisticsService.setSelectedPlayerId(player.playerId);
    this.queryParams.pushQueryParams({ selected: player.playerId });
  }

  getStatisticBlocks(): readonly StatisticBlock[] {
    return statisticBlocks;
  }
}
