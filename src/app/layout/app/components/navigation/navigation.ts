import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '@core/auth/auth-service';
import { DirectionalityService } from '@core/config/directionality-service';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlertTriangle,
  lucideBarChart3,
  lucideBot,
  lucideCalendarDays,
  lucideChevronRight,
  lucideFileText,
  lucideFolderOpen,
  lucideGauge,
  lucideKanbanSquare,
  lucideLayoutDashboard,
  lucideLock,
  lucideSettings,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';
import { NavGroup } from '../../model/navigation';
import { NavSecondary } from '../secondary/nav-secondary';
import { NavUser } from '../user/user';

@Component({
  selector: 'adm-navigation',
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmTooltipImports,
    HlmDropdownMenuImports,
    NgIcon,
    NavUser,
    NavSecondary,
    RouterLink,
    RouterModule,
    NgOptimizedImage,
    TranslocoModule,
  ],
  templateUrl: './navigation.html',
  providers: [
    provideIcons({
      lucideLayoutDashboard,
      lucideChevronRight,
      lucideGauge,
      lucideBarChart3,
      lucideFileText,
      lucideFolderOpen,
      lucideUsers,
      lucideCalendarDays,
      lucideKanbanSquare,
      lucideLock,
      lucideAlertTriangle,
      lucideSettings,
      lucideBot,
    }),
  ],
})
export class Navigation {
  // ==========================================
  // Services
  // ==========================================

  private readonly _dir = inject(DirectionalityService);
  private readonly _authService = inject(AuthService);
  private readonly _sidebarService = inject(HlmSidebarService);

  // ==========================================
  // State
  // ==========================================

  protected readonly side = computed<'left' | 'right'>(() => (this._dir.isRtl() ? 'right' : 'left'));
  protected readonly sideBarCollapsed = computed(
    () => this._sidebarService.state() === 'collapsed' && !this._sidebarService.isMobile()
  );

  protected readonly _navigationGroups: NavGroup[] = [
    {
      label: 'application',
      items: [
        {
          title: 'Dashboard',
          key: 'dashboard',
          icon: 'lucideLayoutDashboard',
          children: [
            { title: 'Dashboard 1', key: 'dashboard-1', url: '/dashboard/dashboard-1', icon: 'lucideGauge' },
            { title: 'Dashboard 2', key: 'dashboard-2', url: '/dashboard/dashboard-2', icon: 'lucideLayoutDashboard' },
          ],
        },
        { title: 'Users', key: 'users', url: '/users', icon: 'lucideUsers' },
        { title: 'Calendar', key: 'calendar', url: '/calendar', icon: 'lucideCalendarDays' },
        { title: 'Kanban', key: 'kanban', url: '/kanban', icon: 'lucideKanbanSquare' },
        { title: 'File Manager', key: 'fileManager', url: '/file-manager', icon: 'lucideFolderOpen' },
      ],
    },
    {
      label: 'pages',
      items: [
        {
          title: 'Authentication',
          key: 'authentication',
          icon: 'lucideLock',
          children: [
            { title: 'Login', key: 'login', url: '/login' },
            { title: 'Sign Up', key: 'signup', url: '/signup' },
            { title: 'Reset Password', key: 'resetPassword', url: '/reset-password' },
            { title: 'Two Step Verification', key: 'twoStepVerification', url: '/two-step-verification' },
          ],
        },
        {
          title: 'Errors',
          key: 'errors',
          icon: 'lucideAlertTriangle',
          children: [
            { title: 'Not Found', key: 'notFound', url: '/404-not-found' },
            { title: 'Service Unavailable', key: 'serviceUnavailable', url: '/503-service-unavailable' },
            { title: 'Unauthorized', key: 'unauthorized', url: '/401-unauthorized' },
          ],
        },
      ],
    },
    {
      label: 'other',
      items: [
        { title: 'settings', key: 'settings', url: '/settings', icon: 'lucideSettings' },
        { title: 'aiAssistant', key: 'aiAssistant', url: '/assistant', icon: 'lucideBot' },
      ],
    },
  ];

  protected readonly user = this._authService.currentUser;
}
