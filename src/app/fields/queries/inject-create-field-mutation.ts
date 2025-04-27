import { inject } from "@angular/core";
import { injectMutation } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { FieldsService } from "@fields/fields.service";
import { CreateFieldRequest } from "@fields/interfaces/create-field-request.interface";

export function injectCreateFieldMutation() {
  const fieldsService = inject(FieldsService);
  return injectMutation(() => ({
    mutationFn: (request: CreateFieldRequest) => lastValueFrom(fieldsService.createField(request)),
    onSuccess: () => fieldsService.handleOnSuccessMutation(),
  }));
}