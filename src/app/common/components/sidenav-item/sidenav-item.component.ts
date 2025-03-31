import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'f5pi-sidenav-item',
  styleUrl: './sidenav-item.component.css',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent {
  item = input.required<{ icon: string; path: string; label: string }>();
}
