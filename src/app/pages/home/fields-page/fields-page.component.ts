import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FieldsWidgetComponent } from "@fields/components/fields-widget/fields-widget.component";

@Component({
  selector: 'f5pi-fields-page',
  imports: [FieldsWidgetComponent],
  templateUrl: './fields-page.component.html',
  styleUrl: './fields-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldsPageComponent {

}
