import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'f5pi-sidenav-item',
  styleUrl: './sidenav-item.component.css',
  templateUrl: './sidenav-item.component.html',
})
export class SidenavItemComponent {
  private readonly router = inject(Router);
  private readonly currentUrl = signal(this.router.url);
  item = input.required<{ icon: string; path: string; label: string }>();

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl.set(event.urlAfterRedirects);
    });
  }

  readonly isActive = computed(() => {
    const currentUrl = this.currentUrl().split('?')[0];
    const itemPath = this.item().path.startsWith('/') ? this.item().path : '/' + this.item().path;
    return currentUrl === itemPath;
  });
}
