import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

import { DEFAULT_THEME, THEME_STORAGE_NAME } from '@common/common.constants';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly cookieService = inject(SsrCookieService);
  private readonly _currentTheme = signal<'light' | 'dark'>(DEFAULT_THEME);
  currentTheme = computed(() => this._currentTheme());

  constructor() {
    this._currentTheme.set((this.cookieService.get(THEME_STORAGE_NAME) as 'light' | 'dark') || 'light');
  }

  setTheme(theme: 'light' | 'dark') {
    this.document.body.setAttribute('data-theme', theme);
    this.cookieService.set(THEME_STORAGE_NAME, theme, { path: '/' });
    this._currentTheme.set(theme);
  }

  toggleTheme() {
    const current = this._currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}
