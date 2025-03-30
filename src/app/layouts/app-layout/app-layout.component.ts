import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

import { SidenavItemComponent } from '@common/components/sidenav-item/sidenav-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, RouterOutlet, SidenavItemComponent],
  selector: 'f5pi-app-layout',
  styleUrl: './app-layout.component.scss',
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {
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
