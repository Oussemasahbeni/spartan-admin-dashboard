import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { BackToTop } from '../../shared/components/back-to-top/back-to-top';
import { SiteHeader } from './header/site-header';
import { Navigation } from './navigation/navigation';

@Component({
  selector: 'adm-main-layout',
  imports: [Navigation, SiteHeader, RouterOutlet, HlmSidebarImports, BackToTop],
  template: `
    <adm-back-to-top />
    <adm-navigation>
      <main hlmSidebarInset>
        <site-header />
        <section class="flex-1 p-6">
          <router-outlet />
        </section>
      </main>
    </adm-navigation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
