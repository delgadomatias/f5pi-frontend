import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { CreateFieldRequest } from '@fields/interfaces/requests/create-field-request.interface';
import { CreateFieldService } from '@fields/services/create-field.service';
import { FieldsService } from '@fields/services/fields.service';
import { GetFieldsService } from '@fields/services/get-fields.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GenericDialogComponent, MatFormFieldModule, MatIconModule, MatInputModule, ReactiveFormsModule],
  selector: 'f5pi-new-field-dialog',
  styleUrl: './new-field-dialog.component.scss',
  templateUrl: './new-field-dialog.component.html',
  providers: [CreateFieldService],
})
export class NewFieldDialogComponent implements OnInit {
  clientStorage = inject(ClientStorageService);
  dialogRef = inject(MatDialogRef);
  fieldsService = inject(FieldsService);
  formBuilder = inject(NonNullableFormBuilder);
  createFieldService = inject(CreateFieldService);
  getFieldsService = inject(GetFieldsService);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
  });

  ngOnInit(): void {
    this.syncStateFromStorage();
  }

  handleSubmit() {
    if (this.form.invalid) return;
    this.clientStorage.remove('new-field-form');
    this.dialogRef.disableClose = true;

    this.createFieldService.execute(this.form.getRawValue()).subscribe({
      next: () => this.dialogRef.close(),
      error: () => (this.dialogRef.disableClose = false),
    });
  }

  private syncStateFromStorage() {
    const saved = this.clientStorage.get<CreateFieldRequest>('new-field-form');
    if (saved) this.form.patchValue(saved);
    this.form.valueChanges.subscribe((values) => this.clientStorage.set('new-field-form', values));
  }
}
