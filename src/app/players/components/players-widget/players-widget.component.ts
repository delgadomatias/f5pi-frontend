import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { NewPlayerDialogComponent } from '@players/components/new-player-dialog/new-player-dialog.component';
import { PlayersService } from '@players/players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericWidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    TableActionsComponent,
  ],
  selector: 'f5pi-players-widget',
  styleUrl: './players-widget.component.css',
  templateUrl: './players-widget.component.html',
})
export class PlayersWidgetComponent {
  dialog = inject(MatDialog);

  playersService = inject(PlayersService);
  playersResource = rxResource({ loader: () => this.playersService.getPlayers() });

  openNewPlayerDialog() {
    const dialogRef = this.dialog.open(NewPlayerDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) this.playersResource.reload();
      },
    });
  }
}
