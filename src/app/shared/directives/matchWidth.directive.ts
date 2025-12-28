import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, OnDestroy, PLATFORM_ID, inject, input } from '@angular/core';

@Directive({
  selector: '[matchWidth]',
})
export class MatchWidthDirective implements AfterViewInit, OnDestroy {
  private _el = inject(ElementRef);
  private _platformId = inject(PLATFORM_ID);
  private _resizeObserver?: ResizeObserver;

  readonly targetElement = input.required<HTMLElement | { nativeElement: HTMLElement }>({
    alias: 'matchWidth',
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
      const target = this.targetElement();
      // Handle both raw HTMLElement and Angular ElementRef/Component with nativeElement
      const elementToObserve = target instanceof HTMLElement ? target : target.nativeElement;

      if (!elementToObserve) return;

      this._resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Use borderBoxSize for accuracy, fallback to contentRect
          const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
          this._el.nativeElement.style.width = `${width}px`;
        }
      });

      this._resizeObserver.observe(elementToObserve);
    }
  }

  ngOnDestroy() {
    this._resizeObserver?.disconnect();
  }
}
