import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';

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

  createFieldMutation = injectMutation(() => ({
    mutationFn: (createFieldRequest: CreateFieldRequest) => lastValueFrom(this.createField(createFieldRequest)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  deleteFieldMutation = injectMutation(() => ({
    mutationFn: (fieldId: string) => lastValueFrom(this.deleteField(fieldId)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  updateFieldMutation = injectMutation(() => ({
    mutationFn: (updateFieldRequest: UpdateFieldRequest) => lastValueFrom(this.updateField(updateFieldRequest)),
    onSuccess: () => this.handleOnSuccessMutation(),
  }));

  createGetFieldsQuery() {
    const pageNumber = signal<number>(0);

    return {
      pageNumber,
      query: injectQuery(() => ({
        queryFn: () => lastValueFrom(this.getFields({ pageNumber: pageNumber() })),
        queryKey: [GET_FIELDS_KEY, pageNumber()],
        staleTime: Infinity,
      })),
    };
  }

  private getFields(params: PaginatedRequest = DEFAULT_PAGINATION_PARAMS) {
    const userId = this.authService.getUserId();
    return this.http.get<FieldResponse>(`${environment.apiUrl}/api/v1/users/${userId}/fields`, {
      params: { ...params, pageSize: 20 },
    });
  }

  private createField(createFieldRequest: CreateFieldRequest) {
    const userId = this.authService.getUserId();
    return this.http.post<Field>(this.baseUrl, {
      ...createFieldRequest,
      userId,
    });
  }

  private deleteField(fieldId: Field['fieldId']) {
    return this.http.delete<Field>(`${this.baseUrl}/${fieldId}`);
  }

  private updateField(updateFieldRequest: UpdateFieldRequest) {
    const { fieldId, name } = updateFieldRequest;
    return this.http.patch<Field>(`${this.baseUrl}/${fieldId}`, {
      name,
    });
  }

  private async handleOnSuccessMutation() {
    await Promise.all([
      this.queryClient.invalidateQueries({ queryKey: [GET_FIELDS_KEY] }),
      this.queryClient.invalidateQueries({ queryKey: [GET_GAMES_KEY] }),
    ]);
  }
}
