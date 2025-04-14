import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, CommonModule, CdkTrapFocus, MatButtonModule, MatProgressSpinnerModule],
  selector: 'f5pi-generic-dialog',
  styleUrl: './generic-dialog.component.css',
  templateUrl: './generic-dialog.component.html',
})
export class GenericDialogComponent {
  dialogTitle = input.required<string>();
  content = contentChild.required('content', { read: TemplateRef });
  isPending = input<boolean>(false);
  showSaveButton = input<boolean>(true);
}
