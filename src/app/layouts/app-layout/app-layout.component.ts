import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SidenavComponent } from '@common/components/sidenav/sidenav.component';
import { ToolbarComponent } from '@common/components/toolbar/toolbar.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SidenavComponent, ToolbarComponent],
  selector: 'f5pi-app-layout',
  templateUrl: './app-layout.component.html',
})
export class AppLayoutComponent {}
