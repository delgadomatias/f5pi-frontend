import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { environment } from '@environments/environment';
import { CreateFieldRequest } from '@fields/interfaces/create-field-request.interface';
import { Field } from '@fields/interfaces/field.interface';
import { FieldResponse } from '@fields/interfaces/fields-response.interface';

@Injectable({
  providedIn: 'root',
})
export class FieldsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/fields`;

  getFields(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<FieldResponse>(`http://localhost:8080/api/v1/users/${userId}/fields`, {
      params: { ...params },
    });
  }

  createField(createFieldRequest: CreateFieldRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Field>(this.baseUrl, {
      ...createFieldRequest,
      userId,
    });
  }

  deleteField(fieldId: Field['fieldId']) {
    return this.http.delete<Field>(`${this.baseUrl}/${fieldId}`);
  }

  updateField(fieldId: Field['fieldId'], name: Field['fieldName']) {
    return this.http.patch<Field>(`${this.baseUrl}/${fieldId}`, {
      name,
    });
  }
}
