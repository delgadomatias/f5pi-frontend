import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule],
  selector: 'f5pi-table-actions',
  styleUrl: './table-actions.component.css',
  templateUrl: './table-actions.component.html',
})
export class TableActionsComponent {
  entityName = input.required<string>();
  onDelete = output();
  onEdit = output();
}
