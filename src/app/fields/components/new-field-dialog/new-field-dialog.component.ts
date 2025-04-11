import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { FieldsService } from '@fields/fields.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  selector: 'f5pi-new-field-dialog',
  styleUrl: './new-field-dialog.component.css',
  templateUrl: './new-field-dialog.component.html',
})
export class NewFieldDialogComponent {
  dialogRef = inject(MatDialogRef);
  fieldsService = inject(FieldsService);
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
  });

  handleSubmit() {
    if (this.form.invalid) return;
    this.fieldsService.createFieldMutation.mutate(this.form.getRawValue(), {
      onSuccess: () => this.dialogRef.close(),
    });
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.fieldsService.createFieldMutation);
  }
}
