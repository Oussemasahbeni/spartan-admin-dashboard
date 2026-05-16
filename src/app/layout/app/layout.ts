import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { BackToTop } from '../../shared/components/back-to-top/back-to-top';
import { SiteHeader } from './components/header/site-header';
import { Navigation } from './components/navigation/navigation';

@Component({
  selector: 'adm-main-layout',
  imports: [Navigation, SiteHeader, RouterOutlet, HlmSidebarImports, BackToTop],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @defer (on idle) {
      <adm-back-to-top />
    }
    <adm-navigation>
      <main hlmSidebarInset>
        <adm-site-header />
        <div class="flex-1 p-4 sm:p-6">
          <router-outlet />
        </div>
      </main>
    </adm-navigation>
  `,
})
export class MainLayout {}
