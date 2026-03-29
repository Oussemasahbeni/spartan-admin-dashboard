import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideMaximize } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'adm-full-screen',
  imports: [HlmButtonImports, HlmIconImports, HlmTooltipImports, TranslocoPipe],
  providers: [
    provideIcons({
      lucideMaximize,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      hlmBtn
      variant="outline"
      size="icon"
      aria-label="Full Screen"
      [hlmTooltip]="'header.toggleFullScreen' | transloco"
      [position]="'bottom'"
      (click)="toggleFullscreen()"
    >
      <ng-icon hlm size="sm" name="lucideMaximize" />
    </button>
  `,
})
export class FullScreen {
  private readonly _document = inject(DOCUMENT);

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle the fullscreen mode
   */
  protected toggleFullscreen(): void {
    if (!this._document.fullscreenEnabled) {
      console.log('Fullscreen is not available in this browser.');
      return;
    }

    // Check if the fullscreen is already open
    const fullScreen = this._document.fullscreenElement;

    // Toggle the fullscreen
    if (fullScreen) {
      this._document.exitFullscreen();
    } else {
      this._document.documentElement.requestFullscreen().catch(() => {
        console.error('Entering fullscreen mode failed.');
      });
    }
  }
}
