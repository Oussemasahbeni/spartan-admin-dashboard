import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { BreadcrumbsHeader } from '@shared/components/breadcrumbs-header/breadcrumbs-header';
import { ThemeSwitch } from '@shared/components/theme-switch/theme-switch';
import { HlmBreadcrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { CommandPalette } from '../command-palette/command-palette';
import { Notifications } from '../notifications/notifications';

@Component({
  selector: 'adm-site-header',
  imports: [
    HlmSidebarImports,
    HlmSeparatorImports,
    HlmBreadcrumbImports,
    HlmTooltipImports,
    Notifications,
    BreadcrumbsHeader,
    ThemeSwitch,
    CommandPalette,
    TranslocoDirective,
  ],
  template: `
    <header
      class="bg-background/95 sticky top-0 z-30 flex h-14 w-full shrink-0 items-center justify-between gap-2 border-b px-6 backdrop-blur"
    >
      <div class="flex items-center gap-2">
        <button type="button" hlmSidebarTrigger (click)="onResize()">
          <span *transloco="let t" class="sr-only">{{ t('common.toggleSidebar') }}</span>
        </button>
        <hlm-separator orientation="vertical" class="me-2" />
        <adm-breadcrumbs-header />
      </div>
      <div class="flex items-center gap-4">
        <adm-command-palette />
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
