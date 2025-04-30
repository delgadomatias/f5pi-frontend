import { inject } from "@angular/core";
import { injectMutation, QueryClient } from "@tanstack/angular-query-experimental";
import { lastValueFrom } from "rxjs";

import { GET_FIELDS_KEY } from "@fields/fields.constants";
import { FieldsService } from "@fields/fields.service";
import { Field } from "@fields/interfaces/field.interface";

export function injectDeleteFieldMutation() {
  const fieldsService = inject(FieldsService);
  const queryClient = inject(QueryClient);
  return injectMutation(() => ({
    mutationFn: (fieldId: Field['fieldId']) => lastValueFrom(fieldsService.deleteField(fieldId)),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: [GET_FIELDS_KEY] }),
  }));
}