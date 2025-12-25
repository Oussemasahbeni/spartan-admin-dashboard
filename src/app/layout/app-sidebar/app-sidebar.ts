import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBarChart3,
  lucideCalendarDays,
  lucideCheckSquare,
  lucideChevronRight,
  lucideCommand,
  lucideFileText,
  lucideGauge,
  lucideLayoutDashboard,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmCollapsibleImports } from '@spartan-ng/helm/collapsible';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { DirectionalityService } from '../../shared/service/directionality.service';
import { NavSecondary } from './secondary/nav-secondary';
import { NavUser } from './user/user';

@Component({
  selector: 'app-sidebar',
  imports: [
    HlmSidebarImports,
    HlmCollapsibleImports,
    HlmIconImports,
    NavUser,
    NavSecondary,
  ],
  templateUrl: './app-sidebar.html',
  providers: [
    provideIcons({
      lucideCommand,
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

  readonly side = computed<'left' | 'right'>(() =>
    this._directionalityService.isRtl() ? 'right' : 'left'
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

  protected readonly user = {
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar: 'https://i.pravatar.cc/120?u=johndoe',
  };
}
