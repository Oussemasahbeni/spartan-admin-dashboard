import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { BreadcrumbsHeader } from '@shared/components/breadcrumbs-header/breadcrumbs-header';
import { ThemeSwitch } from '@shared/components/theme-switch/theme-switch';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmKbdImports } from '@spartan-ng/helm/kbd';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { FullScreen } from '../full-screen/full-screen';
import { Notifications } from '../notifications/notifications';

@Component({
  selector: 'adm-site-header',
  imports: [
    HlmSidebarImports,
    HlmSeparatorImports,
    HlmBreadCrumbImports,
    HlmTooltipImports,
    HlmKbdImports,
    Notifications,
    BreadcrumbsHeader,
    ThemeSwitch,
    TranslocoDirective,
    FullScreen,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="bg-background/95 sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-6 backdrop-blur"
    >
      <div class="flex items-center gap-2">
        <button
          type="button"
          hlmSidebarTrigger
          [aria-label]="'Toggle sidebar'"
          [hlmTooltip]="tooltip"
          [position]="'bottom'"
          (click)="onResize()"
        >
          <span class="sr-only">Toggle sidebar</span>
        </button>
        <ng-template #tooltip>
          <div *transloco="let t; prefix: 'header'" class="flex items-center justify-center gap-2">
            <span> {{ isSidebarOpen() ? t('closeSidebar') : t('openSidebar') }} </span>
            <kbd hlmKbdGroup>
              <kbd hlmKbd class="bg-primary-foreground/20 text-primary-foreground">Ctrl + B</kbd>
            </kbd>
          </div>
        </ng-template>
        <hlm-separator orientation="vertical" class="me-2" />
        <adm-breadcrumbs-header />
      </div>
      <div class="flex items-center gap-4">
        <adm-full-screen />
        <adm-theme-switch />
        <adm-notifications />
      </div>
    </header>
  `,
})
export class SiteHeader {
  // ==========================================
  // Services
  // ==========================================

  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _sideBarService = inject(HlmSidebarService);

  // ==========================================
  // State
  // ==========================================
  protected readonly isSidebarOpen = computed(() => this._sideBarService.open());

  // ==========================================
  // Public Methods
  // ==========================================

  onResize() {
    if (isPlatformBrowser(this._platformId)) {
      // Trigger a resize event to notify charts to resize
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 250);
    }
  }
}
