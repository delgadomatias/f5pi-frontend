import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'f5pi-soccer-ball',
  styleUrl: './soccer-ball.component.css',
  templateUrl: './soccer-ball.component.html',
})
export class SoccerBallComponent {}
