import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SidenavItemComponent } from '@common/components/sidenav-item/sidenav-item.component';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, SidenavItemComponent, MatButtonModule, MatIconModule],
  selector: 'f5pi-sidenav',
  styleUrl: './sidenav.component.scss',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  document = inject(DOCUMENT);
  clientStorage = inject(ClientStorageService);
  currentTheme = signal(this.clientStorage.get('theme') || 'light');
  sidebarItems = signal([
    {
      path: '/',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      path: "/games",
      icon: 'sports_soccer',
      label: 'Games',
    },
    {
      path: '/players',
      icon: 'group',
      label: 'Players',
    },
    {
      path: '/seasons',
      icon: 'calendar_month',
      label: 'Seasons',
    },
    {
      path: '/fields',
      icon: 'ballot',
      label: 'Fields',
    },
  ]);

  toggleTheme() {
    const newTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.document.body.setAttribute('data-theme', newTheme);
    this.clientStorage.set('theme', newTheme);
    this.currentTheme.set(newTheme);
  }
}
