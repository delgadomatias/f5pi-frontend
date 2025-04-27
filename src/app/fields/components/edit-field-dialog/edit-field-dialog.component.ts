import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { FieldsService } from '@fields/fields.service';
import { Field } from '@fields/interfaces/field.interface';
import { injectUpdateFieldMutation } from '@fields/queries/inject-update-field-mutation';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    GenericDialogComponent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-edit-field',
  styleUrl: './edit-field-dialog.component.css',
  templateUrl: './edit-field-dialog.component.html',
})
export class EditFieldDialogComponent {
  dialogRef = inject(MatDialogRef);
  field = inject(MAT_DIALOG_DATA) as Field;
  fieldsService = inject(FieldsService);
  updateField = injectUpdateFieldMutation();
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    name: [this.field.fieldName, [Validators.required, Validators.maxLength(20)]],
  });

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const updatedName = this.form.getRawValue().name;
    if (updatedName === this.field.fieldName) return this.dialogRef.close(false);
    this.updateField.mutate(
      { fieldId: this.field.fieldId, name: updatedName },
      { onSuccess: () => this.dialogRef.close() }
    );
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.updateField);
  }
}
