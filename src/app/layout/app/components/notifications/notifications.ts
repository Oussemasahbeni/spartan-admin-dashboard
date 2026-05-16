import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { STATIC_NOTIFICATIONS } from '@core/mock/notifications.data';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBell, lucideX } from '@ng-icons/lucide';
import { TimeAgoPipe } from '@shared/pipes/timeago/time-ago.pipe';

import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { Notification } from '../../model/notification';

@Component({
  selector: 'adm-notifications',
  imports: [
    HlmAvatarImports,
    HlmBadge,
    HlmButton,
    HlmEmptyImports,
    HlmScrollAreaImports,
    NgScrollbarModule,
    HlmIconImports,
    HlmPopoverImports,
    TranslocoModule,
    TimeAgoPipe,
  ],
  providers: [provideIcons({ lucideBell, lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover *transloco="let t; prefix: 'notifications'" sideOffset="10" align="end">
      <button type="button" variant="outline" size="icon" class="relative size-9" hlmPopoverTrigger hlmBtn>
        <ng-icon hlm name="lucideBell" size="sm" />
        @if (unreadCount() > 0) {
          <span
            hlmBadge
            class="absolute -top-2 left-full flex min-w-5 -translate-x-1/2 items-center justify-center px-1 py-px"
          >
            {{ unreadCount() }}
          </span>
        }
      </button>
      <div *hlmPopoverPortal="let ctx" hlmPopoverContent class="grid w-80 gap-1 p-1">
        <div class="flex items-center justify-between px-3 py-2">
          <span class="text-sm font-semibold">{{ t('title') }}</span>
          @if (unreadCount() > 0) {
            <button type="button" class="text-xs hover:underline focus:outline-none" (click)="markAllAsRead()">
              {{ t('markAllAsRead') }}
            </button>
          }
        </div>
        <hr class="border-muted -mx-1" />
        <ng-scrollbar class="max-h-96 overflow-y-auto" hlm appearance="native">
          <ul>
            @for (notification of notifications(); track notification.id) {
              <li>
                <button
                  type="button"
                  class="hover:bg-muted flex w-full items-start justify-between gap-2 rounded-md px-3 py-2 text-start transition-colors select-none"
                  (click)="markAsRead($index)"
                >
                  <hlm-avatar class="border-border/50 size-10 border">
                    <img hlmAvatarImage [src]="notification.avatar" [alt]="notification.user" />
                    <span hlmAvatarFallback>
                      {{ notification.user.charAt(0) }}
                    </span>
                  </hlm-avatar>

                  <div class="flex flex-1 justify-between">
                    <div>
                      <div class="text-sm">
                        <span class="font-medium">{{ notification.user }}</span>
                        {{ t('actions.' + notification.action) }}
                        <span class="font-medium">{{ t('subjects.' + notification.subject) }}.</span>
                      </div>
                      <div class="text-muted-foreground text-xs">{{ notification.date | timeAgo }}</div>
                    </div>
                    <div class="flex flex-col items-center gap-3 self-center">
                      @if (notification.unread) {
                        <div class="bg-primary size-1.5 rounded-full"></div>
                      }
                      <button
                        type="button"
                        class="z-20 text-xs hover:underline focus:outline-none"
                        (click)="onClear($index)"
                      >
                        <ng-icon hlmIcon name="lucideX" size="xs" />
                      </button>
                    </div>
                  </div>
                </button>
              </li>
            } @empty {
              <li>
                <div hlmEmpty>
                  <div hlmEmptyHeader>
                    <div hlmEmptyMedia variant="icon">
                      <ng-icon name="lucideBell" />
                    </div>
                    <div hlmEmptyTitle>{{ t('noNotifications') }}</div>
                    <div hlmEmptyDescription>{{ t('noNotificationsDescription') }}</div>
                  </div>
                </div>
              </li>
            }
          </ul>
        </ng-scrollbar>

        @if (notifications().length !== 0) {
          <hr class="border-muted -mx-1" />
          <button type="button" hlmBtn class="w-full" variant="ghost" (click)="onClearAll()">
            {{ t('clearAll') }}
          </button>
        }
      </div>
    </hlm-popover>
  `,
})
export class Notifications {
  // ==========================================
  // State
  // ==========================================

  protected readonly notifications = signal<Notification[]>(structuredClone(STATIC_NOTIFICATIONS));

  protected readonly unreadCount = computed(() => this.notifications().filter((notification) => notification.unread).length);

  // ==========================================
  // Public Methods
  // ==========================================

  public markAsRead(index: number): void {
    this.notifications.update((notifications) =>
      notifications.map((notification, i) =>
        i === index && notification.unread ? { ...notification, unread: false } : notification
      )
    );
  }

  public markAllAsRead(): void {
    this.notifications.update((notifications) =>
      notifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  public onClear(index: number): void {
    this.notifications.update((notifications) => notifications.filter((_, i) => i !== index));
  }

  public onClearAll(): void {
    this.notifications.set([]);
  }
}
