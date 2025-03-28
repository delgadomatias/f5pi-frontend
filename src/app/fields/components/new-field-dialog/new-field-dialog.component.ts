import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { FieldsService } from '@fields/fields.service';

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
  selector: 'f5pi-new-field-dialog',
  styleUrl: './new-field-dialog.component.css',
  templateUrl: './new-field-dialog.component.html',
})
export class NewFieldDialogComponent {
  formBuilder = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef);
  fieldsService = inject(FieldsService);
  error = signal<string | null>(null);
  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
  });

  handleSubmit() {
    if (this.form.invalid) return;
    this.fieldsService.createField(this.form.getRawValue()).subscribe({
      error: (error) => this.error.set(error.error.message),
      next: () => this.dialogRef.close(true),
    });
  }
}
