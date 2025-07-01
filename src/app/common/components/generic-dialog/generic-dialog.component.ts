import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkTrapFocus,
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  selector: 'f5pi-generic-dialog',
  styleUrl: './generic-dialog.component.scss',
  templateUrl: './generic-dialog.component.html',
})
export class GenericDialogComponent {
  dialogTitle = input.required<string>();
  content = contentChild.required('content', { read: TemplateRef });
  isPending = input<boolean>(false);
  showSaveButton = input<boolean>(true);
}
