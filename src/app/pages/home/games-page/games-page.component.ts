import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GamesWidgetComponent } from "@games/components/games-widget/games-widget.component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GamesWidgetComponent],
  selector: 'f5pi-games-page',
  styleUrl: './games-page.component.css',
  templateUrl: './games-page.component.html',
})
export class GamesPageComponent {

}
