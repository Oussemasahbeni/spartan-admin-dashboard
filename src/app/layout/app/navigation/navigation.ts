import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '@core/user/auth.service';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideAlertTriangle,
  lucideBarChart3,
  lucideCalendarDays,
  lucideCheckSquare,
  lucideChevronRight,
  lucideFileText,
  lucideGauge,
  lucideLayoutDashboard,
  lucideLock,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports, HlmSidebarService } from '@spartan-ng/helm/sidebar';
import { DirectionalityService } from '../../../core/config/directionality.service';
import { NavGroup } from '../navigation.types';
import { NavSecondary } from '../secondary/nav-secondary';
import { NavUser } from '../user/user';

@Component({
  selector: 'adm-navigation',
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmIconImports,
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
      lucideUsers,
      lucideCalendarDays,
      lucideCheckSquare,
      lucideLock,
      lucideAlertTriangle,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  private readonly _dir = inject(DirectionalityService);
  private readonly _authService = inject(AuthService);
  private readonly _sidebarService = inject(HlmSidebarService);

  readonly side = computed<'left' | 'right'>(() => (this._dir.isRtl() ? 'right' : 'left'));
  readonly sideBarCollapsed = computed(() => this._sidebarService.state() === 'collapsed');

  protected readonly _navigationGroups: NavGroup[] = [
    {
      label: 'application',
      items: [
        {
          title: 'Dashboard',
          key: 'dashboard',
          icon: 'lucideLayoutDashboard',
          children: [
            { title: 'Overview', key: 'overview', url: '/dashboard/overview', icon: 'lucideGauge' },
            { title: 'Analytics', key: 'analytics', url: '#', icon: 'lucideBarChart3' },
            { title: 'Reports', key: 'reports', url: '#', icon: 'lucideFileText' },
            { title: 'Dashboard 2', key: 'dashboard-2', url: '/dashboard/dashboard-2', icon: 'lucideLayoutDashboard' },
          ],
        },
        { title: 'Users', key: 'users', url: '/users', icon: 'lucideUsers' },
        { title: 'Calendar', key: 'calendar', url: '#', icon: 'lucideCalendarDays' },
        { title: 'Tasks', key: 'tasks', url: '#', icon: 'lucideCheckSquare' },
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
            { title: 'Forgot Password', key: 'forgotPassword', url: '/forgot-password' },
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
  ];

  protected readonly user = this._authService.currentUser;
}
