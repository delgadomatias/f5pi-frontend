import { inject, Injectable } from '@angular/core';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { UpdateFieldRequest } from '@fields/interfaces/requests/update-field-request.interface';
import { INFINITE_FIELDS_QUERY_KEY } from '@fields/queries/inject-get-infinite-fields';
import { FieldsService } from '@fields/services/fields.service';
import { GetFieldsService } from '@fields/services/get-fields.service';
import { GetGamesService } from '@games/services/get-games.service';

@Injectable()
export class UpdateFieldService {
  private readonly fieldsService = inject(FieldsService);
  private readonly getFieldsService = inject(GetFieldsService);
  private readonly getGamesService = inject(GetGamesService);
  private readonly queryClient = inject(QueryClient);
  private readonly mutation = mutationPerformer();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(updateFieldRequest: UpdateFieldRequest) {
    return this.mutation
      .mutate(() => this.fieldsService.updateField(updateFieldRequest))
      .pipe(tap({ next: () => this.handleOnSuccess() }));
  }

  private handleOnSuccess() {
    this.getFieldsService.reload();
    this.getGamesService.reload();
    this.queryClient.invalidateQueries({ queryKey: [INFINITE_FIELDS_QUERY_KEY] });
  }
}
