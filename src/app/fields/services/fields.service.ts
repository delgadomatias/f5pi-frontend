import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { createPaginationParams } from '@common/utils/create-pagination-params';
import { environment } from '@environments/environment';
import { CreateFieldRequest } from '@fields/interfaces/requests/create-field-request.interface';
import { UpdateFieldRequest } from '@fields/interfaces/requests/update-field-request.interface';
import { Field } from '@fields/interfaces/responses/field.interface';
import { FieldResponse } from '@fields/interfaces/responses/fields-response.interface';

@Injectable({ providedIn: 'root' })
export class FieldsService {
  private readonly BASE_URL = `${environment.API_URL}/api/v1/fields`;
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  getFields(paginationParams: PaginatedRequest): Observable<FieldResponse> {
    const userId = this.authService.getUserId();
    const { pageNumber, pageSize } = paginationParams;
    return this.http.get<FieldResponse>(`${environment.API_URL}/api/v1/users/${userId}/fields`, {
      params: createPaginationParams(
        pageNumber ?? DEFAULT_PAGINATION_PARAMS.pageNumber,
        pageSize ?? DEFAULT_PAGINATION_PARAMS.pageSize
      ),
    });
  }

  createField(createFieldRequest: CreateFieldRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Field>(this.BASE_URL, {
      ...createFieldRequest,
      userId,
    });
  }

  deleteField(fieldId: Field['fieldId']) {
    return this.http.delete<Field>(`${this.BASE_URL}/${fieldId}`);
  }

  updateField(updateFieldRequest: UpdateFieldRequest) {
    const { fieldId, name } = updateFieldRequest;
    return this.http.patch<Field>(`${this.BASE_URL}/${fieldId}`, { name });
  }
}
