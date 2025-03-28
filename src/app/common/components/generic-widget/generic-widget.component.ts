import { CommonModule } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { ScrollShadowDirective } from '@common/directives/scroll-shadow.directive';

@Component({
  imports: [CommonModule, MatCardModule, ScrollShadowDirective],
  selector: 'f5pi-generic-widget',
  standalone: true,
  styleUrl: './generic-widget.component.css',
  templateUrl: './generic-widget.component.html',
})
export class GenericWidgetComponent {
  widgetTitle = input.required<string>();
  headerActions = contentChild.required('headerActions', { read: TemplateRef });
  content = contentChild.required('content', { read: TemplateRef });
  footer = contentChild.required('footer', { read: TemplateRef });
}
