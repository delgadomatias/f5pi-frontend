import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SeasonsWidgetComponent } from '@seasons/components/seasons-widget/seasons-widget.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeasonsWidgetComponent],
  selector: 'f5pi-seasons-page',
  styleUrl: './seasons-page.component.css',
  templateUrl: './seasons-page.component.html',
})
export class SeasonsPageComponent {
  titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Seasons — F5pi');
  }
}
