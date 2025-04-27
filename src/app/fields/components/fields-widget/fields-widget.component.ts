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
import { EditFieldDialogComponent } from '@fields/components/edit-field-dialog/edit-field-dialog.component';
import { NewFieldDialogComponent } from '@fields/components/new-field-dialog/new-field-dialog.component';
import { FieldsService } from '@fields/fields.service';
import { Field } from '@fields/interfaces/field.interface';
import { injectDeleteFieldMutation } from '@fields/queries/inject-delete-field-mutation';
import { injectGetFieldsQuery } from '@fields/queries/inject-get-fields-query';

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
  deleteFieldMutation = injectDeleteFieldMutation();
  getFieldsQuery = injectGetFieldsQuery();

  ngOnInit() {
    this.checkQueryParams();
  }

  openNewFieldDialog() {
    this.entityDialogService.openNewEntityDialog(NewFieldDialogComponent, { entity: 'field' }).subscribe();
  }

  openEditFieldDialog(field: Field) {
    this.entityDialogService.openEditEntityDialog(EditFieldDialogComponent, { data: field });
  }

  handleDeleteField(field: Field) {
    this.deleteFieldMutation.mutate(field.fieldId);
  }

  onPageChangeEvent(event: PageEvent) {
    const { pageIndex } = event;
    this.getFieldsQuery.setPageNumber(pageIndex);
  }

  private checkQueryParams() {
    const params = this.queryParamsService.queryParams();
    if (!params) return;
    if (params['entity'] === 'field' && params['action'] === 'new') this.openNewFieldDialog();
  }
}
