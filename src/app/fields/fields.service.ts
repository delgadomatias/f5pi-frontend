import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';

import { AuthService } from '@auth/auth.service';
import { DEFAULT_PAGINATION_PARAMS } from '@common/common.constants';
import { PaginatedRequest } from '@common/interfaces/paginated-request.interface';
import { environment } from '@environments/environment';
import { GET_FIELDS_KEY } from '@fields/fields.constants';
import { CreateFieldRequest } from '@fields/interfaces/create-field-request.interface';
import { Field } from '@fields/interfaces/field.interface';
import { FieldResponse } from '@fields/interfaces/fields-response.interface';
import { UpdateFieldRequest } from '@fields/interfaces/update-field-request.interface';
import { GET_GAMES_KEY } from '@games/games.constants';

@Injectable({
  providedIn: 'root',
})
export class FieldsService {
  private readonly authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/fields`;
  private readonly http = inject(HttpClient);
  private readonly queryClient = inject(QueryClient);

  getFields(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<FieldResponse>(`${environment.apiUrl}/api/v1/users/${userId}/fields`, {
      params: { ...params, pageSize: 20 },
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

  updateField(updateFieldRequest: UpdateFieldRequest) {
    const { fieldId, name } = updateFieldRequest;
    return this.http.patch<Field>(`${this.baseUrl}/${fieldId}`, {
      name,
    });
  }

  async handleOnSuccessMutation() {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: [GET_FIELDS_KEY] }),
      this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] }),
    ]);
  }
}
