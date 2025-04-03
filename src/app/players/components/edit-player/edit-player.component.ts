import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ImagePickerComponent } from '@common/components/image-picker/image-picker.component';
import { Player } from '@players/interfaces/player.interface';
import { PlayersService } from '@players/players.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GenericDialogComponent,
    ImagePickerComponent,
    MatButtonModule,
    MatDialogClose,
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
  isLoading = signal(false);

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

    this.isLoading.set(true);
    this.dialogRef.disableClose = true;
    if (hasImageChanged && !hasNameChanged) {
      const { image } = this.form.getRawValue();
      this.playersService
        .uploadPlayerImage({
          playerId: this.player.playerId,
          image: image as File,
        })
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.dialogRef.close(true);
          },
        });
      return;
    }

    const { name } = this.form.getRawValue();
    this.playersService.updatePlayer(this.player.playerId, { name }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
    });
  }

  onImageSelected(image: File | null) {
    this.form.patchValue({ image });
  }
}
