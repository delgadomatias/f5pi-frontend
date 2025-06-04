
import { computed, inject, Injectable, signal, DOCUMENT } from '@angular/core';

import { ClientStorageService } from '@common/services/client-storage.service.abstract';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private document = inject(DOCUMENT);
  private clientStorage = inject(ClientStorageService);
  private _currentTheme = signal<'light' | 'dark'>(this.clientStorage.get('theme') || 'light');
  currentTheme = computed(() => this._currentTheme());

  setTheme(theme: 'light' | 'dark') {
    this.document.body.setAttribute('data-theme', theme);
    this.clientStorage.set('theme', theme);
    this._currentTheme.set(theme);
  }

  toggleTheme() {
    const current = this._currentTheme();
    const next = current === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }
}