import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, MatMenuModule],
  selector: 'f5pi-table-actions',
  styleUrl: './table-actions.component.scss',
  templateUrl: './table-actions.component.html',
  host: { ngSkipHydration: 'true' },
})
export class TableActionsComponent {
  entityName = input<string>('');
  disabled = input<boolean>(false);
  onDelete = output();
  onEdit = output();
}
