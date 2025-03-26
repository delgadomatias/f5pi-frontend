import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule],
  selector: 'f5pi-sidenav-item',
  styleUrl: './sidenav-item.component.css',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent {
  item = input.required<{ icon: string; path: string; label: string }>();
}
