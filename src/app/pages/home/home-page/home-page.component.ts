import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { GenericWidgetComponent } from '@common/components/generic-widget/generic-widget.component';
import { FieldsWidgetComponent } from '@fields/components/fields-widget/fields-widget.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FieldsWidgetComponent, MatButtonModule, MatCardModule, GenericWidgetComponent],
  selector: 'f5pi-home-page',
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
