// import { ViewportScroller } from '@angular/common';
// import {
//   ChangeDetectionStrategy,
//   Component,
//   DOCUMENT,
//   inject,
//   input,
//   signal,
//   ViewEncapsulation,
// } from '@angular/core';
// import { provideIcons } from '@ng-icons/core';
// import { radixArrowUp } from '@ng-icons/radix-icons';
// import { HlmButtonImports } from '@spartan-ng/helm/button';
// import { HlmIconImports } from '@spartan-ng/helm/icon';

// @Component({
//   selector: 'app-back-to-top',
//   imports: [HlmButtonImports, HlmIconImports],
//   providers: [provideIcons({ radixArrowUp })],
//   template: `@if (isVisible()) {
//     <button
//       hlmBtn
//       class="fixed z-50 bottom-6 right-6"
//       (click)="scrollToTop()"
//       title="Back to top"
//       size="icon"
//       aria-label="Scroll back to top"
//     >
//       <ng-icon size="sm" name="radixArrowUp" hlm />
//     </button>
//     } `,
//   encapsulation: ViewEncapsulation.None,
//   host: {
//     '(window:scroll)': 'onWindowScroll()',
//   },
//   changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class BackToTop {
//   // -----------------------------------------------------------------------------------------------------
//   // @ Dependencies
//   // -----------------------------------------------------------------------------------------------------
//   private readonly document = inject(DOCUMENT);
//   private readonly viewportScroller = inject(ViewportScroller);

//   // -----------------------------------------------------------------------------------------------------
//   // @ Inputs
//   // -----------------------------------------------------------------------------------------------------
//   readonly showAfter = input(300); // Pixels scrolled before showing
//   readonly scrollToPosition = input(0); // Position to scroll to
//   readonly animationDuration = input(500); // Animation duration in ms

//   // -----------------------------------------------------------------------------------------------------
//   // @ Signals and State
//   // -----------------------------------------------------------------------------------------------------
//   readonly isVisible = signal(false);

//   // -----------------------------------------------------------------------------------------------------
//   // @ Public methods
//   // -----------------------------------------------------------------------------------------------------
//   onWindowScroll(): void {
//     const scrollPosition =
//       this.document.documentElement.scrollTop || this.document.body.scrollTop;
//     this.isVisible.set(scrollPosition > this.showAfter());
//   }

//   scrollToTop(): void {
//     this.viewportScroller.scrollToPosition([0, 0], { behavior: 'smooth' });
//   }
// }
