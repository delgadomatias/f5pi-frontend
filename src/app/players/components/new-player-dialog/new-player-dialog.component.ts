import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AlertComponent } from '@common/components/alert/alert.component';
import { GenericDialogComponent } from '@common/components/generic-dialog/generic-dialog.component';
import { ImagePickerComponent } from '@common/components/image-picker/image-picker.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';
import { CreatePlayerService } from '@players/services/create-player.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
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
  styleUrl: './new-player-dialog.component.scss',
  templateUrl: './new-player-dialog.component.html',
  providers: [CreatePlayerService],
})
export class NewPlayerDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly clientStorage = inject(ClientStorageService);
  readonly createPlayerService = inject(CreatePlayerService);

  form = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    image: this.formBuilder.control<File | null>(null),
  });

  ngOnInit(): void {
    const saved = this.clientStorage.get<{ name: string; image: File | null }>('new-player-form');
    if (saved) this.form.patchValue(saved);

    this.form.valueChanges.subscribe((values) => {
      this.clientStorage.set('new-player-form', values);
    });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.controls.image.markAsDirty();
      return;
    }

    this.clientStorage.remove('new-player-form');
    const { name, image } = this.form.getRawValue();

    this.dialogRef.disableClose = true;
    this.createPlayerService.execute({ name, image }).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => (this.dialogRef.disableClose = false),
    });
  }

  onImageSelected(image: File | null): void {
    this.form.patchValue({ image });
    this.form.controls.image.markAsDirty();
  }
}
