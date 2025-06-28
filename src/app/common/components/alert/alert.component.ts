import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
  selector: 'f5pi-alert',
  styleUrl: './alert.component.scss',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  message = input<string>('');
}
