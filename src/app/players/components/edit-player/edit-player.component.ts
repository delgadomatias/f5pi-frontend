import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ImagePickerComponent } from '@common/components/image-picker/image-picker.component';
import { getMutationErrorMessage } from '@common/utils/get-mutation-error-message';
import { Player } from '@players/interfaces/player.interface';
import { PlayersService } from '@players/players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    GenericDialogComponent,
    ImagePickerComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  selector: 'f5pi-edit-player',
  styleUrl: './edit-player.component.css',
  templateUrl: './edit-player.component.html',
})
export class EditPlayerComponent {
  dialogRef = inject(MatDialogRef);
  formBuilder = inject(NonNullableFormBuilder);
  player = inject(MAT_DIALOG_DATA) as Player;
  playersService = inject(PlayersService);

  form = this.formBuilder.group({
    name: [this.player.name, [Validators.required]],
    imageURL: [this.player.imageURL, [Validators.required]],
    image: this.formBuilder.control<File | null>(null),
  });

  handleSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.controls.image.markAsDirty();
      return;
    }

    const hasImageChanged = this.form.controls.image.value !== null;
    const hasNameChanged = this.form.controls.name.value !== this.player.name;

    if (!hasImageChanged && !hasNameChanged) {
      this.dialogRef.close(false);
      return;
    }

    this.dialogRef.disableClose = true;
    if (hasImageChanged && !hasNameChanged) {
      const { image } = this.form.getRawValue();
      this.playersService.uploadPlayerImageMutation.mutate(
        { playerId: this.player.playerId, image: image as File },
        { onSuccess: () => this.dialogRef.close(), onSettled: () => (this.dialogRef.disableClose = false) }
      );
    } else {
      const { name } = this.form.getRawValue();
      this.playersService.updatePlayerMutation.mutate(
        { playerId: this.player.playerId, name },
        { onSuccess: () => this.dialogRef.close(), onSettled: () => (this.dialogRef.disableClose = false) }
      );
    }
  }

  onImageSelected(image: File | null) {
    this.form.patchValue({ image });
  }

  getErrorMessage() {
    if (this.playersService.updatePlayerMutation.isError()) {
      return getMutationErrorMessage(this.playersService.updatePlayerMutation);
    }
    if (this.playersService.uploadPlayerImageMutation.isError()) {
      return getMutationErrorMessage(this.playersService.uploadPlayerImageMutation);
    }

    return "";
  }
}