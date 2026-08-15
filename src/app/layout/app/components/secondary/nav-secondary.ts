import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLifeBuoy, lucideSend } from '@ng-icons/lucide';
import { svglGithubDark, svglGithubLight } from '@ng-icons/svgl';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';

@Component({
  selector: 'adm-nav-secondary',
  imports: [HlmSidebarImports, NgIcon, RouterLink],
  providers: [provideIcons({ lucideLifeBuoy, lucideSend, svglGithubDark, svglGithubLight })],
  template: `
    <hlm-sidebar-group>
      <div hlmSidebarGroupContent>
        <ul hlmSidebarMenu>
          <li>
            <a
              href="https://github.com/Oussemasahbeni/spartan-admin-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              hlmSidebarMenuButton
              size="sm"
            >
              <ng-icon class="dark:hidden" name="svglGithubLight" />
              <ng-icon class="hidden dark:block" name="svglGithubDark" />
              GitHub
            </a>
          </li>
          @for (item of items(); track $index) {
            <li hlmSidebarMenuItem>
              <a hlmSidebarMenuButton size="sm" [routerLink]="item.url">
                <ng-icon [name]="item.icon" />
                {{ item.title }}
              </a>
            </li>
          }
        </ul>
      </div>
    </hlm-sidebar-group>
  `,
})
export class NavSecondary {
  // ==========================================
  // State
  // ==========================================

  protected readonly items = signal([
    {
      title: 'Support',
      url: '/support',
      icon: 'lucideLifeBuoy',
    },
    {
      title: 'Send Feedback',
      url: '/feedback',
      icon: 'lucideSend',
    },
  ]);
}
