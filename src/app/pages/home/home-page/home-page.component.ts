import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { FieldsWidgetComponent } from '@fields/components/fields-widget/fields-widget.component';
import { GamesWidgetComponent } from '@games/components/games-widget/games-widget.component';
import { PlayersWidgetComponent } from '@players/components/players-widget/players-widget.component';
import { SeasonsWidgetComponent } from '@seasons/components/seasons-widget/seasons-widget.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FieldsWidgetComponent,
    GamesWidgetComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    PlayersWidgetComponent,
    SeasonsWidgetComponent,
  ],
  selector: 'f5pi-home-page',
  styleUrl: './home-page.component.scss',
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
