import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { TableActionsComponent } from '@common/components/table-actions/table-actions.component';
import { EditSeasonComponent } from '@seasons/components/edit-season/edit-season.component';
import { NewSeasonDialogComponent } from '@seasons/components/new-season-dialog/new-season-dialog.component';
import { Season } from '@seasons/interfaces/season.interface';
import { SeasonsService } from '@seasons/seasons.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    GenericWidgetComponent,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    TableActionsComponent,
  ],
  selector: 'f5pi-seasons-widget',
  styleUrl: './seasons-widget.component.scss',
  templateUrl: './seasons-widget.component.html',
})
export class SeasonsWidgetComponent {
  seasonsService = inject(SeasonsService);
  dialog = inject(MatDialog);

  pageNumber = signal<number>(0);
  seasonsResource = rxResource({
    loader: ({ request }) => this.seasonsService.getSeasons(request),
    request: () => ({ pageNumber: this.pageNumber() }),
  });

  openNewSeasonDialog() {
    const dialogRef = this.dialog.open(NewSeasonDialogComponent, {
      backdropClass: 'backdrop',
      enterAnimationDuration: '0ms',
      panelClass: 'full-screen-dialog',
    });

    dialogRef.beforeClosed().subscribe({
      next: (result) => {
        if (result) this.seasonsResource.reload();
      },
    });
  }

  openEditSeasonDialog(season: Season) {
    const dialogRef = this.dialog.open(EditSeasonComponent, {
      backdropClass: 'backdrop',
      data: season,
      enterAnimationDuration: '0ms',
      panelClass: 'full-screen-dialog',
    });

    dialogRef.beforeClosed().subscribe((result) => {
      if (result) this.seasonsResource.reload();
    });
  }

  handleDeleteSeason(season: Season) {
    this.seasonsService.deleteSeason(season.id).subscribe({
      next: () => this.seasonsResource.reload(),
    });
  }

  handlePageChange(event: PageEvent) {
    const { pageIndex } = event;
    this.pageNumber.set(pageIndex);
  }

  trackBySeasonId(_index: number, season: Season) {
    return season.id;
  }
}
