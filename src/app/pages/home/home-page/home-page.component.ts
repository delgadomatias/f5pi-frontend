import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { FieldsWidgetComponent } from '@fields/components/fields-widget/fields-widget.component';
import { GamesWidgetComponent } from '@games/components/games-widget/games-widget.component';
import { PlayersWidgetComponent } from '@players/components/players-widget/players-widget.component';
import { SeasonsWidgetComponent } from '@seasons/components/seasons-widget/seasons-widget.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FieldsWidgetComponent,
    GamesWidgetComponent,
    PlayersWidgetComponent,
    SeasonsWidgetComponent,
  ],
  selector: 'f5pi-home-page',
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  titleService = inject(Title)

  constructor() {
    this.titleService.setTitle('Dashboard | f5pi');
  }
}
