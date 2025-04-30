import { inject } from "@angular/core";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { GET_FIELDS_KEY } from "@fields/fields.constants";
import { FieldsService } from "@fields/fields.service";
import { CreateFieldRequest } from "@fields/interfaces/create-field-request.interface";

export function injectCreateFieldMutation() {
  const fieldsService = inject(FieldsService);
  const queryClient = inject(QueryClient)
  return injectMutation(() => ({
    mutationFn: (request: CreateFieldRequest) => lastValueFrom(fieldsService.createField(request)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GET_FIELDS_KEY] }),
  }));
}