import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { FieldsService } from '@fields/fields.service';
import { Field } from '@fields/interfaces/field.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericDialogComponent,
    MatButtonModule,
    MatDialogClose,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-edit-field',
  styleUrl: './edit-field.component.css',
  templateUrl: './edit-field.component.html',
})
export class EditFieldComponent {
  dialogRef = inject(MatDialogRef);
  field = inject(MAT_DIALOG_DATA) as Field;
  fieldsService = inject(FieldsService);
  formBuilder = inject(NonNullableFormBuilder);
  error = signal<string | null>(null);
  form = this.formBuilder.group({
    name: [this.field.fieldName, [Validators.required, Validators.maxLength(20)]],
  });

  handleOnSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const updatedName = this.form.getRawValue().name;
    if (updatedName === this.field.fieldName) return this.dialogRef.close(false);

    this.fieldsService.updateField(this.field.fieldId, updatedName).subscribe({
      error: (error) => this.error.set(error.error.message),
      next: () => this.dialogRef.close(true),
    });
  }
}
