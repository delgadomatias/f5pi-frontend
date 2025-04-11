import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    const savedTheme = this.clientStorage.get<string>('theme') || 'light';
    this.document.body.setAttribute('data-theme', savedTheme);
  }
}
