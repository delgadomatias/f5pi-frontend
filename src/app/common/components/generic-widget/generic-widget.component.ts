import { CommonModule } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [CommonModule, MatCardModule, MatIconModule],
  selector: 'f5pi-generic-widget',
  standalone: true,
  styleUrl: './generic-widget.component.css',
  templateUrl: './generic-widget.component.html',
})
export class GenericWidgetComponent {
  widgetTitle = input.required<string>();
  icon = input<string | null>(null);
  headerActions = contentChild.required('headerActions', { read: TemplateRef });
  content = contentChild.required('content', { read: TemplateRef });
  footer = contentChild.required('footer', { read: TemplateRef });
}
