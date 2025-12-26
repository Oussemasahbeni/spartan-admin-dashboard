import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { NavSecondary } from '../secondary/nav-secondary';
import { NavUser } from '../user/user';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmIconImports,
    NavUser,
    NavSecondary,
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './app-sidebar.html',
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
export class AppSidebar {
  private readonly _directionalityService = inject(DirectionalityService);
  private readonly _userService = inject(UserService);

  readonly side = computed<'left' | 'right'>(() =>
    this._directionalityService.isRtl() ? 'right' : 'left',
  );

  protected readonly _items = [
    {
      title: 'Dashboard',
      icon: 'lucideLayoutDashboard',
      children: [
        {
          title: 'Overview',
          url: '#',
          icon: 'lucideGauge',
        },
        {
          title: 'Analytics',
          url: '#',
          icon: 'lucideBarChart3',
        },
        {
          title: 'Reports',
          url: '#',
          icon: 'lucideFileText',
        },
      ],
    },
    {
      title: 'Users',
      url: '/users',
      icon: 'lucideUsers',
    },
    {
      title: 'Calendar',
      url: '#',
      icon: 'lucideCalendarDays',
    },
    {
      title: 'Tasks',
      url: '#',
      icon: 'lucideCheckSquare',
    },
  ];

  protected readonly user = this._userService.user;
}
