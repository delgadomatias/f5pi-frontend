import { ChangeDetectionStrategy, Component } from '@angular/core';

import { SeasonsWidgetComponent } from "@seasons/components/seasons-widget/seasons-widget.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SeasonsWidgetComponent],
  selector: 'f5pi-seasons-page',
  styleUrl: './seasons-page.component.css',
  templateUrl: './seasons-page.component.html',
})
export class SeasonsPageComponent {

}
