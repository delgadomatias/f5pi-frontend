import { isPlatformServer } from '@angular/common';
import { Directive, ElementRef, inject, PLATFORM_ID } from '@angular/core';

@Directive({
  selector: '[f5piHideElementOnServer]',
  standalone: true,
})
export class HideElementOnServerDirective {
  private readonly isRunningOnServer = isPlatformServer(inject(PLATFORM_ID));
  private readonly elementRef = inject(ElementRef);

  constructor() {
    const animationStyle = this.isRunningOnServer ? 'none' : '';
    const transitionStyle = this.isRunningOnServer ? 'none' : '';
    const opacityStyle = this.isRunningOnServer ? '0' : '';

    this.elementRef.nativeElement.style.animation = animationStyle;
    this.elementRef.nativeElement.style.transition = transitionStyle;
    this.elementRef.nativeElement.style.opacity = opacityStyle;
  }
}
