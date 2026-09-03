import { ViewportScroller } from '@angular/common';
import { Component, DOCUMENT, inject, input, numberAttribute, signal } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'adm-back-to-top',
  imports: [HlmButtonImports, NgIcon, TranslocoDirective],
  providers: [provideIcons({ lucideArrowUp })],
  host: {
    '(window:scroll)': 'onWindowScroll()',
  },
  template: `
    @if (isVisible()) {
      <button
        *transloco="let t"
        type="button"
        hlmBtn
        class="fixed inset-e-6 bottom-6 z-50 hidden md:inline-flex"
        size="icon"
        (click)="scrollToTop()"
      >
        <span class="sr-only">{{ t('common.backToTop') }}</span>
        <ng-icon name="lucideArrowUp" />
      </button>
    }
  `,
})
export class BackToTop {
  // ==========================================
  // Services
  // ==========================================
  private readonly document = inject(DOCUMENT);
  private readonly viewportScroller = inject(ViewportScroller);

  // ==========================================
  // Inputs
  // ==========================================
  public readonly showAfter = input(300, { transform: numberAttribute }); // Pixels scrolled before showing

  // ==========================================
  // State
  // ==========================================
  protected readonly isVisible = signal(false);

  // ==========================================
  // Public Methods
  // ==========================================
  protected onWindowScroll(): void {
    const scrollPosition = this.document.documentElement.scrollTop || this.document.body.scrollTop;
    this.isVisible.set(scrollPosition > this.showAfter());
  }

  protected scrollToTop(): void {
    this.viewportScroller.scrollToPosition([0, 0], { behavior: 'smooth' });
  }
}
