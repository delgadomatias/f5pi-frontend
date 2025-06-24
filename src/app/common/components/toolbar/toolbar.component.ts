import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ThemeService } from '@common/services/theme.service';
import { delay, EMPTY, filter, of } from 'rxjs';
import { SoccerBallComponent } from '../soccer-ball/soccer-ball.component';

const TOOLBAR_ITEMS = [
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
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgClass, RouterLink, SoccerBallComponent],
  selector: 'f5pi-toolbar',
  styleUrl: './toolbar.component.scss',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  private readonly CURRENT_URL = signal(this.router.url);
  isMenuOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      if (this.isMenuOpen()) this.document.body.style.overflow = 'hidden';
      else this.document.body.style.overflow = 'auto';
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.CURRENT_URL.set(event.urlAfterRedirects);
    });
  }

  handleMenuClick(): void {
    this.isMenuOpen.update((value) => !value);
  }

  isActivePath(path: string): boolean {
    const currentUrl = this.CURRENT_URL().split('?')[0];
    const itemPath = path.startsWith('/') ? path : '/' + path;
    return currentUrl === itemPath;
  }

  handleLinkClick(): void {
    of(EMPTY)
      .pipe(delay(200))
      .subscribe(() => this.isMenuOpen.set(false));
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  readonly TOOLBAR_ITEMS = TOOLBAR_ITEMS;
}
