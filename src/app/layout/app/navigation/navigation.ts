import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBarChart3,
  lucideCalendarDays,
  lucideCheckSquare,
  lucideChevronRight,
  lucideFileText,
  lucideGauge,
  lucideLayoutDashboard,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { DirectionalityService } from '../../../core/config/directionality.service';
import { UserService } from '../../../core/user/user.service';
import { NavigationItem } from '../navigation.types';
import { NavSecondary } from '../secondary/nav-secondary';
import { NavUser } from '../user/user';

@Component({
  selector: 'app-navigation',
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
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navigation {
  private readonly _directionalityService = inject(DirectionalityService);
  private readonly _userService = inject(UserService);

  readonly side = computed<'left' | 'right'>(() =>
    this._directionalityService.isRtl() ? 'right' : 'left',
  );

  protected readonly _items: NavigationItem[] = [
    {
      title: 'Dashboard',
      key: 'dashboard',
      icon: 'lucideLayoutDashboard',
      children: [
        {
          title: 'Overview',
          key: 'overview',
          url: '#',
          icon: 'lucideGauge',
        },
        {
          title: 'Analytics',
          key: 'analytics',
          url: '#',
          icon: 'lucideBarChart3',
        },
        {
          title: 'Reports',
          key: 'reports',
          url: '#',
          icon: 'lucideFileText',
        },
      ],
    },
    {
      title: 'Users',
      key: 'users',
      url: '/users',
      icon: 'lucideUsers',
    },
    {
      title: 'Calendar',
      key: 'calendar',
      url: '#',
      icon: 'lucideCalendarDays',
    },
    {
      title: 'Tasks',
      key: 'tasks',
      url: '#',
      icon: 'lucideCheckSquare',
    },
  ];

  protected readonly user = this._userService.user;
}
