import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { CreateSeasonRequest } from '@seasons/interfaces/requests/create-season-request.interface';
import { CreateSeasonService } from '@seasons/services/create-season.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    GenericDialogComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-new-season-dialog',
  styleUrl: './new-season-dialog.component.scss',
  templateUrl: './new-season-dialog.component.html',
  providers: [CreateSeasonService],
})
export class NewSeasonDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly clientStorage = inject(ClientStorageService);
  readonly createSeasonService = inject(CreateSeasonService);

  form = this.formBuilder.group({
    name: this.formBuilder.control<string>('', [Validators.required]),
    initialDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
    finalDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const saved = this.clientStorage.get<{ name: string; initialDate: Date | null; finalDate: Date | null }>(
      'new-season-form'
    );
    if (saved) this.form.patchValue(saved);

    this.form.valueChanges.subscribe((values) => {
      this.clientStorage.set('new-season-form', values);
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.disableClose = true;
    this.clientStorage.remove('new-season-form');
    const name = this.form.getRawValue().name as string;
    const initialDate = this.form.getRawValue().initialDate as Date;
    const finalDate = this.form.getRawValue().finalDate as Date;

    const createSeasonRequest: CreateSeasonRequest = {
      name,
      initialDate: initialDate.toISOString().split('T')[0],
      finalDate: finalDate.toISOString().split('T')[0],
    };

    this.createSeasonService.execute(createSeasonRequest).subscribe({
      next: () => this.dialogRef.close(),
      error: () => (this.dialogRef.disableClose = false),
    });
  }
}
