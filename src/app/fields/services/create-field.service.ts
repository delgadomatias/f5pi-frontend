import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { CreateFieldRequest } from '@fields/interfaces/requests/create-field-request.interface';
import { Field } from '@fields/interfaces/responses/field.interface';
import { INFINITE_FIELDS_QUERY_KEY } from '@fields/queries/inject-get-infinite-fields';
import { FieldsService } from '@fields/services/fields.service';
import { GetFieldsService } from '@fields/services/get-fields.service';

@Injectable()
export class CreateFieldService {
  private readonly fieldsService = inject(FieldsService);
  private readonly getFieldsService = inject(GetFieldsService);
  private readonly queryClient = inject(QueryClient);
  private readonly mutation = mutationPerformer<Field>();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(createFieldRequest: CreateFieldRequest) {
    return this.mutation
      .mutate(() => this.fieldsService.createField(createFieldRequest))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getFieldsService.reload();
    this.queryClient.invalidateQueries({ queryKey: [INFINITE_FIELDS_QUERY_KEY] });
  }
}
