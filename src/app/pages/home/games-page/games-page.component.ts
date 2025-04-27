import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { GamesWidgetComponent } from "@games/components/games-widget/games-widget.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GamesWidgetComponent],
  selector: 'f5pi-games-page',
  styleUrl: './games-page.component.css',
  templateUrl: './games-page.component.html',
})
export class GamesPageComponent {
  titleService = inject(Title)

  constructor() {
    this.titleService.setTitle('Games | f5pi');
  }
}
