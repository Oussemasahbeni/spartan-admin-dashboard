import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { SiteHeader } from './header/site-header';
import { AppSidebar } from './sidebar/app-sidebar';

@Component({
  selector: 'app-main-layout',
  imports: [AppSidebar, SiteHeader, RouterOutlet, HlmSidebarImports],
  template: `
    <app-sidebar>
      <main hlmSidebarInset>
        <site-header />
        <section class="flex-1 p-6">
          <router-outlet />
        </section>
      </main>
    </app-sidebar>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayout {}
