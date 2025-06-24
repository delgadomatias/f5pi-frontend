import { FieldId } from '@fields/interfaces/responses/field.interface';

export interface UpdateFieldRequest {
  fieldId: FieldId;
  name: string;
}
