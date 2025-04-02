import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, CommonModule, CdkTrapFocus],
  selector: 'f5pi-generic-dialog',
  styleUrl: './generic-dialog.component.css',
  templateUrl: './generic-dialog.component.html',
})
export class GenericDialogComponent {
  dialogTitle = input.required<string>();
  content = contentChild.required('content', { read: TemplateRef });
  footer = contentChild.required('footer', { read: TemplateRef });
}
