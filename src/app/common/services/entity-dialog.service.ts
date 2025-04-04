import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';

import { QueryParamsService } from './query-params.service';

interface DialogConfig extends MatDialogConfig {
  entity: string;
}

@Injectable({ providedIn: 'root' })
export class EntityDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly queryParamsService = inject(QueryParamsService);

  openNewEntityDialog<T>(component: ComponentType<T>, config: DialogConfig) {
    const { entity, ...rest } = config;
    this.queryParamsService.pushQueryParams({ entity, action: 'new' });
    const dialogRef = this.dialog.open(component, rest);
    return dialogRef.afterClosed().pipe(
      finalize(() => {
        this.queryParamsService.clearQueryParams();
      })
    );
  }

  openEditEntityDialog<T>(component: ComponentType<T>, config?: MatDialogConfig) {
    const dialogRef = this.dialog.open(component, config);
    return dialogRef.afterClosed();
  }
}
