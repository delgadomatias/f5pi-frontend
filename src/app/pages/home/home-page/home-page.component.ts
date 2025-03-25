import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'f5pi-home-page',
  styleUrl: './home-page.component.css',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
