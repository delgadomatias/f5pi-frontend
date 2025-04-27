import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { FieldsService } from "@fields/fields.service";
import { UpdateFieldRequest } from "@fields/interfaces/update-field-request.interface";

export function injectUpdateFieldMutation() {
  const fieldsService = inject(FieldsService);
  return injectMutation(() => ({
    mutationFn: (updateFieldRequest: UpdateFieldRequest) =>
      lastValueFrom(fieldsService.updateField(updateFieldRequest)),
    onSuccess: () => fieldsService.handleOnSuccessMutation(),
  }));
}