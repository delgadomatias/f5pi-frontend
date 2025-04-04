import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
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
import { EditFieldComponent } from '@fields/components/edit-field/edit-field.component';
import { NewFieldDialogComponent } from '@fields/components/new-field-dialog/new-field-dialog.component';
import { FieldsService } from '@fields/fields.service';
import { Field } from '@fields/interfaces/field.interface';

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
    TableActionsComponent,
  ],
  selector: 'f5pi-fields-widget',
  styleUrl: './fields-widget.component.css',
  templateUrl: './fields-widget.component.html',
})
export class FieldsWidgetComponent implements OnInit {
  entityDialogService = inject(EntityDialogService);
  fieldsService = inject(FieldsService);
  queryParamsService = inject(QueryParamsService);

  pageNumber = signal<number>(0);
  fieldsResource = rxResource({
    loader: ({ request }) => this.fieldsService.getFields(request),
    request: () => ({ pageNumber: this.pageNumber() }),
  });

  ngOnInit(): void {
    const params = this.queryParamsService.queryParams();
    if (!params) return;
    if (params['entity'] === 'field' && params['action'] === 'new') this.openNewFieldDialog();
  }

  openNewFieldDialog() {
    this.entityDialogService
      .openNewEntityDialog(NewFieldDialogComponent, {
        entity: 'field',
      })
      .subscribe({
        next: (result) => {
          if (result) this.fieldsResource.reload();
        },
      });
  }

  openEditFieldDialog(field: Field) {
    this.entityDialogService.openEditEntityDialog(EditFieldComponent, { data: field }).subscribe({
      next: (result) => {
        if (result) this.fieldsResource.reload();
      },
    });
  }

  onPageChangeEvent(event: PageEvent) {
    const { pageIndex } = event;
    this.pageNumber.set(pageIndex);
  }

  handleDeleteField(field: Field) {
    this.fieldsService.deleteField(field.fieldId).subscribe({
      next: () => this.fieldsResource.reload(),
    });
  }
}
