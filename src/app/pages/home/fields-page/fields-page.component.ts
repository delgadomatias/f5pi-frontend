import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FieldsWidgetComponent } from '@fields/components/fields-widget/fields-widget.component';

@Component({
  selector: 'f5pi-fields-page',
  imports: [FieldsWidgetComponent],
  templateUrl: './fields-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldsPageComponent {
  titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Fields — F5pi');
  }
}
