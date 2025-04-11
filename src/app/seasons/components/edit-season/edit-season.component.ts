import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { Season } from '@seasons/interfaces/season.interface';
import { SeasonsService } from '@seasons/seasons.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericDialogComponent,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'f5pi-edit-season',
  styleUrl: './edit-season.component.css',
  templateUrl: './edit-season.component.html',
})
export class EditSeasonComponent {
  dialogRef = inject(MatDialogRef);
  formBuilder = inject(FormBuilder);
  season = inject(MAT_DIALOG_DATA) as Season;
  seasonsService = inject(SeasonsService);

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

    this.seasonsService.updateSeasonMutation.mutate(
      {
        seasonId: this.season.id,
        name,
        initialDate,
        finalDate,
      },
      { onSuccess: () => this.dialogRef.close(true) }
    );
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.seasonsService.updateSeasonMutation);
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
