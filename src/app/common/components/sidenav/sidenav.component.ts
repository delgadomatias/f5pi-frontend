import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SidenavItemComponent } from '@common/components/sidenav-item/sidenav-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, SidenavItemComponent],
  selector: 'f5pi-sidenav',
  styleUrl: './sidenav.component.scss',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  sidebarItems = signal([
    {
      path: '/',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      path: '/players',
      icon: 'group',
      label: 'Players',
    },
    {
      path: '/fields',
      icon: 'ballot',
      label: 'Fields',
    },
  ]);
}
