import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmBreadCrumbImports } from '@spartan-ng/helm/breadcrumb';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'site-header',
  imports: [HlmSidebarImports, HlmSeparatorImports, HlmBreadCrumbImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-30 flex h-14 w-full items-center gap-2 border-b bg-background/95 backdrop-blur shrink-0"
    >
      <div class="flex items-center gap-2 px-4">
        <button type="button" hlmSidebarTrigger>
          <span class="sr-only"></span>
        </button>
        <hlm-separator
          orientation="vertical"
          class="mr-2 data-[orientation=vertical]:h-4"
        />
        <nav hlmBreadcrumb>
          <ol hlmBreadcrumbList>
            <li hlmBreadcrumbItem class="hidden sm:block">
              <a hlmBreadcrumbLink link="/">Home</a>
            </li>
            <li hlmBreadcrumbSeparator class="hidden sm:block"></li>
            <li hlmBreadcrumbItem>
              <a hlmBreadcrumbPage>Data Fetching</a>
            </li>
          </ol>
        </nav>
      </div>
    </header>
  `,
})
export class SiteHeader {}
