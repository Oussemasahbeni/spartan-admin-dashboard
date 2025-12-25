import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { AppSidebar } from './layout/app-sidebar/app-sidebar';
import { SiteHeader } from './layout/app-sidebar/header/site-header';

@Component({
  selector: 'app-root',
  imports: [AppSidebar, HlmSidebarImports, RouterOutlet, SiteHeader],
  template: ` <app-sidebar>
    <main hlmSidebarInset>
      <header class="flex h-12 items-center justify-between ">
        <site-header />
        <router-outlet />
      </header>

      <!-- <section class="flex-1 p-6">
        <router-outlet />
      </section> -->
    </main>
  </app-sidebar>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('spartan-admin-dashboard');
}
