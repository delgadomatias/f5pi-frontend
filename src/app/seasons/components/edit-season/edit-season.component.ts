import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { Season } from '@seasons/interfaces/responses/season.interface';
import { UpdateSeasonService } from '@seasons/services/update-season.service';

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
  selector: 'f5pi-edit-season',
  styleUrl: './edit-season.component.scss',
  templateUrl: './edit-season.component.html',
  providers: [UpdateSeasonService],
})
export class EditSeasonComponent {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly formBuilder = inject(FormBuilder);
  readonly season = inject<Season>(MAT_DIALOG_DATA);
  readonly updateSeasonService = inject(UpdateSeasonService);

  form = this.formBuilder.group({
    name: this.formBuilder.control<string>(this.season.name, [Validators.required]),
    initialDate: this.formBuilder.control<Date | null>(new Date(`${this.season.initialDate}T12:00:00`), [
      Validators.required,
    ]),
    finalDate: this.formBuilder.control<Date | null>(new Date(`${this.season.finalDate}T12:00:00`), [
      Validators.required,
    ]),
  });

  handleSubmit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    if (!this.hasSeasonChanged()) return this.dialogRef.close(false);

    const name = this.form.getRawValue().name as string;
    const initialDate = this.form.getRawValue().initialDate?.toISOString().split('T')[0] as string;
    const finalDate = this.form.getRawValue().finalDate?.toISOString().split('T')[0] as string;

    this.updateSeasonService
      .execute({
        seasonId: this.season.id,
        name,
        initialDate,
        finalDate,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
      });
  }

  private hasSeasonChanged() {
    const { name, initialDate, finalDate } = this.form.getRawValue();
    return (
      name !== this.season.name ||
      initialDate?.toISOString().split('T')[0] !== this.season.initialDate ||
      finalDate?.toISOString().split('T')[0] !== this.season.finalDate
    );
  }
}
