import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  selector: 'f5pi-toolbar',
  styleUrl: './toolbar.component.scss',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {

}
