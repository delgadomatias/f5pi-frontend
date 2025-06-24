import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';

import { mutationPerformer } from '@common/services/mutation-performer.service';
import { Field } from '@fields/interfaces/responses/field.interface';
import { FieldsService } from '@fields/services/fields.service';
import { GetFieldsService } from '@fields/services/get-fields.service';

@Injectable()
export class DeleteFieldService {
  private readonly fieldsService = inject(FieldsService);
  private readonly getFieldsService = inject(GetFieldsService);
  private readonly mutation = mutationPerformer();

  isPending = this.mutation.isPending;
  error = this.mutation.error;

  execute(fieldId: Field['fieldId']) {
    return this.mutation
      .mutate(() => this.fieldsService.deleteField(fieldId))
      .pipe(tap({ next: () => this.getFieldsService.reload() }));
  }
}
