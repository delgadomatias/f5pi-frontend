import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  selector: 'f5pi-soccer-ball',
  styleUrl: './soccer-ball.component.scss',
  templateUrl: './soccer-ball.component.html',
})
export class SoccerBallComponent {
  width = input<number>(300);
  height = input<number>(300);

  @HostBinding('style.--width')
  get cssWidth() {
    return `${this.width()}px`;
  }

  @HostBinding('style.--height')
  get cssHeight() {
    return `${this.height()}px`;
  }
}
