import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FieldsWidgetComponent } from '@fields/components/fields-widget/fields-widget.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldsWidgetComponent],
  selector: 'f5pi-fields-page',
  templateUrl: './fields-page.component.html',
})
export class FieldsPageComponent {
  titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Fields — F5pi');
  }
}
