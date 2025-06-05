import { isPlatformServer } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { DEFAULT_THEME, THEME_STORAGE_NAME } from '@common/common.constants';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  selector: 'f5pi-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  private readonly document = inject(DOCUMENT);
  private readonly cookieService = inject(SsrCookieService);
  private readonly matIconRegistry = inject(MatIconRegistry);
  private readonly isRunningOnServer = isPlatformServer(inject(PLATFORM_ID));

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    const themeToApply = this.cookieService.get(THEME_STORAGE_NAME) || DEFAULT_THEME;
    this.document.body.setAttribute('data-theme', themeToApply);
    this.cookieService.set(THEME_STORAGE_NAME, themeToApply, { path: '/' });
    this.resetLocalStorage();
  }

  private resetLocalStorage(): void {
    if (this.isRunningOnServer) return;
    localStorage.removeItem('new-field-form');
    localStorage.removeItem('new-game-form');
    localStorage.removeItem('new-player-form');
    localStorage.removeItem('new-season-form');
  }
}
