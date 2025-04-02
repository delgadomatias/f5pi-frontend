import { animate, style, transition, trigger } from '@angular/animations';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('0.1s 0.2s', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, NgClass],
  selector: 'f5pi-image-picker',
  styleUrl: './image-picker.component.scss',
  templateUrl: './image-picker.component.html',
})
export class ImagePickerComponent {
  private readonly snackBar = inject(MatSnackBar);

  readonly onImageSelected = output<File | null>();
  readonly error = input<boolean>(false);
  readonly image = signal<File | null>(null);
  readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  readonly maxImageSizeMb = MAX_IMAGE_SIZE_MB;
  readonly allowedImageTypes = ALLOWED_IMAGE_TYPES;

  handleChooseImage() {
    this.fileInput().nativeElement.click();
  }

  handleFileInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const isValid = this.validateImage(file);
    if (!isValid) {
      this.fileInput().nativeElement.value = '';
      return;
    }

    this.image.set(file);
    this.onImageSelected.emit(file);
  }

  handleDeleteImage() {
    this.image.set(null);
    this.onImageSelected.emit(null);
    this.fileInput().nativeElement.value = '';
  }

  buildBlobUrl(file: File): string {
    const blob = new Blob([file], { type: file.type });
    return URL.createObjectURL(blob);
  }

  private validateImage(image: File): boolean {
    if (!this.allowedImageTypes.includes(image.type)) {
      this.snackBar.open('The file type is not allowed.', 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar',
      });
      return false;
    }

    const imageSizeMb = image.size / (1024 * 1024);
    if (imageSizeMb > this.maxImageSizeMb) {
      this.snackBar.open(`The image size exceeds the maximum limit of ${this.maxImageSizeMb} MB.`, 'Close', {
        duration: 5000,
        panelClass: 'error-snackbar',
      });
      return false;
    }

    return true;
  }
}
