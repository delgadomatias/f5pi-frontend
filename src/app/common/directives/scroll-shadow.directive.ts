import { AfterViewInit, Directive, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[f5piScrollShadow]',
  standalone: true,
})
export class ScrollShadowDirective implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private observer: ResizeObserver | null = null;
  private shadowElement: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setStyle(this.el.nativeElement, 'overflow', 'auto');

    this.createShadowElement();

    this.checkForOverflow();

    fromEvent(this.el.nativeElement, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateShadowState());

    this.observer = new ResizeObserver(() => {
      this.checkForOverflow();
    });
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.observer) {
      this.observer.disconnect();
    }

    if (this.shadowElement && this.shadowElement.parentNode) {
      this.shadowElement.parentNode.removeChild(this.shadowElement);
    }
  }

  private createShadowElement(): void {
    this.shadowElement = this.renderer.createElement('div');

    this.renderer.setStyle(this.shadowElement, 'position', 'sticky');
    this.renderer.setStyle(this.shadowElement, 'bottom', '0');
    this.renderer.setStyle(this.shadowElement, 'left', '0');
    this.renderer.setStyle(this.shadowElement, 'width', '100%');
    this.renderer.setStyle(this.shadowElement, 'height', '20px');
    this.renderer.setStyle(this.shadowElement, 'pointer-events', 'none');
    this.renderer.setStyle(this.shadowElement, 'z-index', '10');
    this.renderer.setStyle(
      this.shadowElement,
      'background-image',
      'linear-gradient(to bottom,rgba(255,255,255,0)0,rgba(255,255,255,0.9) 100%)'
    );

    this.renderer.setStyle(this.shadowElement, 'opacity', '0');
    this.renderer.appendChild(this.el.nativeElement, this.shadowElement);
  }

  private checkForOverflow(): void {
    this.updateShadowState();
  }

  private updateShadowState(): void {
    if (!this.shadowElement) return;

    const element = this.el.nativeElement;
    const isBottomScrollAvailable = element.scrollHeight > element.clientHeight + element.scrollTop;
    this.renderer.setStyle(this.shadowElement, 'opacity', isBottomScrollAvailable ? '100' : '0');
  }
}
