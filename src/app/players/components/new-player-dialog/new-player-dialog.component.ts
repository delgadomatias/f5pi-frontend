import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ImagePickerComponent } from '@common/components/image-picker/image-picker.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { PlayersService } from '@players/players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericDialogComponent,
    ImagePickerComponent,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AlertComponent,
  ],
  selector: 'f5pi-new-player-dialog',
  styleUrl: './new-player-dialog.component.css',
  templateUrl: './new-player-dialog.component.html',
})
export class NewPlayerDialogComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly playersService = inject(PlayersService);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    image: this.formBuilder.control<File | null>(null, [Validators.required]),
  });

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.controls.image.markAsDirty();
      return;
    }

    const { name, image } = this.form.getRawValue();
    if (!image) return;

    this.dialogRef.disableClose = true;
    this.playersService.createPlayerWithImageMutation.mutate(
      { name, image },
      { onSuccess: () => this.dialogRef.close(true), onSettled: () => (this.dialogRef.disableClose = false) }
    );
  }

  onImageSelected(image: File | null): void {
    this.form.patchValue({ image });
    this.form.controls.image.markAsDirty();
  }

  getErrorMessage() {
    return getMutationErrorMessage(this.playersService.createPlayerWithImageMutation);
  }
}
