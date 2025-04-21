import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { CreateSeasonRequest } from '@seasons/interfaces/create-season-request.interface';
import { SeasonsService } from '@seasons/seasons.service';

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
  providers: [provideNativeDateAdapter()],
  selector: 'f5pi-new-season-dialog',
  styleUrl: './new-season-dialog.component.scss',
  templateUrl: './new-season-dialog.component.html',
})
export class NewSeasonDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly seasonsService = inject(SeasonsService);

  form = this.formBuilder.group({
    name: this.formBuilder.control<string>('', [Validators.required]),
    initialDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
    finalDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
  });

  ngOnInit(): void {
    const saved = localStorage.getItem('new-season-form');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.form.patchValue(parsed);
      } catch { }
    }

    this.form.valueChanges.subscribe((values) => {
      localStorage.setItem('new-season-form', JSON.stringify(values));
    });
  }

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    localStorage.removeItem('new-season-form');
    const name = this.form.getRawValue().name as string;
    const initialDate = this.form.getRawValue().initialDate as Date;
    const finalDate = this.form.getRawValue().finalDate as Date;

    const createSeasonRequest: CreateSeasonRequest = {
      name,
      initialDate: initialDate.toISOString().split('T')[0],
      finalDate: finalDate.toISOString().split('T')[0],
    };

    this.seasonsService.createSeasonMutation.mutate(createSeasonRequest, {
      onSuccess: () => this.dialogRef.close(),
    });
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.seasonsService.createSeasonMutation);
  }
}
