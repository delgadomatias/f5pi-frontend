import { computed, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { BasePaginatedResourceService } from '@common/services/base-paginated-resource.service';
import { FieldResponse } from '@fields/interfaces/responses/fields-response.interface';
import { FieldsService } from '@fields/services/fields.service';

@Injectable({ providedIn: 'root' })
export class GetFieldsService extends BasePaginatedResourceService<FieldResponse> {
  private readonly fieldsService = inject(FieldsService);
  fields = computed(() => this.response()?.content || []);

  protected override getResourceStream(params: PaginatedRequest): Observable<FieldResponse> {
    return this.fieldsService.getFields(params);
  }
}
