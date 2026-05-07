import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '@core/config/breadcrumb.service';
import { TranslocoModule } from '@jsverse/transloco';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';

@Component({
  selector: 'adm-breadcrumbs-header',
  imports: [HlmBreadCrumbImports, RouterLink, TranslocoModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <nav *transloco="let t" hlmBreadcrumb>
    <ol hlmBreadcrumbList>
      <!-- Home link - always visible -->
      <li hlmBreadcrumbItem class="hidden sm:block">
        <a hlmBreadcrumbLink link="/">{{ t('breadcrumbs.home') }}</a>
      </li>

      <!-- Dynamic breadcrumbs -->
      @for (crumb of breadcrumbs(); track crumb.url; let isLast = $last) {
        <li hlmBreadcrumbSeparator class="hidden sm:block rtl:rotate-180"></li>
        <li hlmBreadcrumbItem>
          @if (isLast) {
            <span hlmBreadcrumbPage>{{ t(crumb.label) }}</span>
          } @else {
            <a hlmBreadcrumbLink class="hidden sm:block" [link]="crumb.url">{{ t(crumb.label) }}</a>
          }
        </li>
      }
    </ol>
  </nav>`,
})
export class BreadcrumbsHeader {
  // ==========================================
  // Services
  // ==========================================
  private readonly _breadcrumbService = inject(BreadcrumbService);

  // ==========================================
  // State
  // ==========================================
  protected readonly breadcrumbs = this._breadcrumbService.breadcrumbs;
}
