import { ChangeDetectionStrategy, Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '@auth/auth.service';

import { SidenavItemComponent } from '@common/components/sidenav-item/sidenav-item.component';
import { ThemeService } from '@common/services/theme.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatSidenavModule, SidenavItemComponent, MatButtonModule, MatIconModule],
  selector: 'f5pi-sidenav',
  styleUrl: './sidenav.component.scss',
  templateUrl: './sidenav.component.html',
})
export class SidenavComponent {
  document = inject(DOCUMENT);
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  sidebarItems = signal([
    {
      path: '/',
      icon: 'dashboard',
      label: 'Dashboard',
    },
    {
      path: '/games',
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
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
