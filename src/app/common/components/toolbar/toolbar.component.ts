import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, NgClass],
  selector: 'f5pi-toolbar',
  styleUrl: './toolbar.component.scss',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  private readonly document = inject(DOCUMENT);
  isMenuOpen = signal<boolean>(false);

  constructor() {
    effect(() => {
      const drawerContent = this.document.querySelector('mat-drawer-content') as HTMLElement | null;
      if (!drawerContent) return;
      if (this.isMenuOpen()) drawerContent.style.overflow = 'hidden';
      else drawerContent.style.overflow = 'auto';
    });
  }

  handleMenuClick(): void {
    this.isMenuOpen.update((value) => !value);
  }
}
