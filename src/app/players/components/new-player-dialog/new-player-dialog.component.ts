import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, switchMap } from 'rxjs';

import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ImagePickerComponent } from '@common/components/image-picker/image-picker.component';
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
  ],
  selector: 'f5pi-new-player-dialog',
  styleUrl: './new-player-dialog.component.css',
  templateUrl: './new-player-dialog.component.html',
})
export class NewPlayerDialogComponent {
  readonly dialogRef = inject(MatDialogRef);
  readonly formBuilder = inject(NonNullableFormBuilder);
  readonly playersService = inject(PlayersService);
  readonly isCreating = signal<boolean>(false);

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

    this.isCreating.set(true);
    this.dialogRef.disableClose = true;

    this.playersService
      .createPlayer({ name })
      .pipe(
        switchMap((createdPlayer) => {
          const { playerId } = createdPlayer;
          return this.playersService.uploadPlayerImage({ playerId, image });
        }),
        finalize(() => {
          this.isCreating.set(false);
          this.dialogRef.disableClose = false;
        })
      )
      .subscribe({
        next: () => this.dialogRef.close(true),
      });
  }

  onImageSelected(image: File | null): void {
    this.form.patchValue({ image });
    this.form.controls.image.markAsDirty();
  }
}
