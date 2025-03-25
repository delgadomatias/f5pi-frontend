import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SoccerBallComponent } from '@common/components/soccer-ball/soccer-ball.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SoccerBallComponent],
  selector: 'f5pi-auth-layout',
  styleUrl: './auth-layout.component.css',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {}
