import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { GamesService } from '@games/games.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericWidgetComponent, MatTableModule, DatePipe, CurrencyPipe, TableActionsComponent],
  selector: 'f5pi-games-widget',
  styleUrl: './games-widget.component.css',
  templateUrl: './games-widget.component.html',
})
export class GamesWidgetComponent {
  gamesService = inject(GamesService);
  gamesResource = rxResource({ loader: () => this.gamesService.getGames() });
}
