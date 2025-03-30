import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { CreateSeasonRequest } from '@seasons/interfaces/create-season-request.interface';
import { SeasonsService } from '@seasons/seasons.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericDialogComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogClose,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-new-season-dialog',
  styleUrl: './new-season-dialog.component.scss',
  templateUrl: './new-season-dialog.component.html',
  providers: [provideNativeDateAdapter()],
})
export class NewSeasonDialogComponent {
  dialogRef = inject(MatDialogRef);
  seasonsService = inject(SeasonsService);
  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    name: this.formBuilder.control<string>('', [Validators.required]),
    initialDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
    finalDate: this.formBuilder.control<Date | null>(null, [Validators.required]),
  });

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const name = this.form.getRawValue().name as string;
    const initialDate = this.form.getRawValue().initialDate as Date;
    const finalDate = this.form.getRawValue().finalDate as Date;

    const createSeasonRequest: CreateSeasonRequest = {
      name,
      initialDate: initialDate.toISOString().split('T')[0],
      finalDate: finalDate.toISOString().split('T')[0],
    };

    this.seasonsService.createSeason(createSeasonRequest).subscribe({
      next: () => this.dialogRef.close(true),
    });
  }
}
