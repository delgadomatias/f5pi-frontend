
import { ChangeDetectionStrategy, Component, inject, DOCUMENT } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { ClientStorageService } from '@common/services/client-storage.service.abstract';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  selector: 'f5pi-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  document = inject(DOCUMENT);
  clientStorage = inject(ClientStorageService);
  matIconRegistry = inject(MatIconRegistry);

  constructor() {
    this.matIconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    const savedTheme = this.clientStorage.get<string>('theme');
    const preferredTheme = this.getPreferredTheme();
    const themeToApply = savedTheme || preferredTheme;
    this.document.body.setAttribute('data-theme', themeToApply);
    this.clientStorage.set('theme', themeToApply);
    this.clientStorage.remove('new-field-form');
    this.clientStorage.remove('new-game-form');
    this.clientStorage.remove('new-player-form');
    this.clientStorage.remove('new-season-form');
  }

  private getPreferredTheme(): string {
    const darkModeMediaQuery = this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)');
    return darkModeMediaQuery?.matches ? 'dark' : 'light';
  }
}
