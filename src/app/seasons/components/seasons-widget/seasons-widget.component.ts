import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    TableActionsComponent,
  ],
  selector: 'f5pi-seasons-widget',
  styleUrl: './seasons-widget.component.scss',
  templateUrl: './seasons-widget.component.html',
})
export class SeasonsWidgetComponent implements OnInit {
  entityDialogService = inject(EntityDialogService);
  queryParamsService = inject(QueryParamsService);
  seasonsService = inject(SeasonsService);
  getSeasonsQuery = this.seasonsService.createGetSeasonsQuery();

  ngOnInit() {
    this.checkQueryParams();
  }

  openNewSeasonDialog() {
    this.entityDialogService.openNewEntityDialog(NewSeasonDialogComponent, { entity: 'season' }).subscribe({
      next: () => this.seasonsService.createSeasonMutation.reset(),
    });
  }

  openEditSeasonDialog(season: Season) {
    this.entityDialogService.openEditEntityDialog(EditSeasonComponent, { data: season }).subscribe({
      next: () => this.seasonsService.updateSeasonMutation.reset(),
    });
  }

  handleDeleteSeason(season: Season) {
    this.seasonsService.deleteSeasonMutation.mutate(season.id);
  }

  handlePageChange(event: PageEvent) {
    const { pageIndex } = event;
    this.getSeasonsQuery.pageNumber.set(pageIndex);
  }

  private checkQueryParams() {
    const params = this.queryParamsService.queryParams();
    if (!params) return;

    const { entity, action } = params;
    if (entity === 'season' && action === 'new') this.openNewSeasonDialog();
  }
}
