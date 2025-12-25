import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCalendar,
  lucideCommand,
  lucideHouse,
  lucideInbox,
  lucideSearch,
  lucideSettings,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSidebarImports } from '@spartan-ng/helm/sidebar';
import { DirectionalityService } from '../../shared/service/directionality.service';
import { NavSecondary } from './secondary/nav-secondary';
import { NavUser } from './user/user';

@Component({
  selector: 'app-sidebar',
  imports: [HlmSidebarImports, HlmIconImports, NavUser, NavSecondary],
  templateUrl: './app-sidebar.html',
  providers: [
    provideIcons({
      lucideHouse,
      lucideInbox,
      lucideCalendar,
      lucideSearch,
      lucideSettings,
      lucideCommand,
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
      title: 'Home',
      url: '#',
      icon: 'lucideHouse',
    },
    {
      title: 'Inbox',
      url: '#',
      icon: 'lucideInbox',
    },
    {
      title: 'Calendar',
      url: '#',
      icon: 'lucideCalendar',
    },
    {
      title: 'Search',
      url: '#',
      icon: 'lucideSearch',
    },
    {
      title: 'Settings',
      url: '#',
      icon: 'lucideSettings',
    },
  ];
  protected readonly user = {
    name: 'Rebecca Parsons',
    email: 'rebecca@gmail.com',
    avatar: 'https://i.pravatar.cc/150?u=rebecca',
  };
}
