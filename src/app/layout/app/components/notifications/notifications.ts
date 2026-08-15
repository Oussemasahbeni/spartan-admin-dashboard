import { Component, computed, signal } from '@angular/core';
import { STATIC_NOTIFICATIONS } from '@core/mock/notifications.data';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideX } from '@ng-icons/lucide';
import { TimeAgoPipe } from '@shared/pipes/timeago/time-ago.pipe';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';

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
    NgIcon,
    HlmPopoverImports,
    TranslocoModule,
    TimeAgoPipe,
  ],
  providers: [provideIcons({ lucideBell, lucideX })],
  template: `
    <hlm-popover *transloco="let t; prefix: 'notifications'" sideOffset="10" align="end">
      <button type="button" variant="outline" size="icon" class="relative size-9" hlmPopoverTrigger hlmBtn>
        <span class="sr-only">{{ t('title') }}</span>
        <ng-icon name="lucideBell" />
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
            <button type="button" hlmBtn variant="ghost" size="sm" (click)="markAllAsRead()">
              {{ t('markAllAsRead') }}
            </button>
          }
        </div>
        <hr class="border-muted -mx-1" />
        <ng-scrollbar class="max-h-96 overflow-y-auto" hlm appearance="native">
          <ul>
            @for (notification of notifications(); track notification.id) {
              <li>
                <div class="hover:bg-muted flex w-full items-start gap-2 rounded-md px-3 py-2 transition-colors">
                  <button
                    type="button"
                    class="focus-visible:ring-ring flex flex-1 items-start gap-2 rounded-md text-start select-none focus-visible:ring-2 focus-visible:outline-none"
                    (click)="markAsRead($index)"
                  >
                    @if (notification.unread) {
                      <div class="bg-primary mt-4 size-1 rounded-full" aria-hidden="true"></div>
                    }
                    <hlm-avatar class="border-border/50 size-10 border">
                      <img hlmAvatarImage loading="lazy" [src]="notification.avatar" [alt]="notification.user" />
                      <span hlmAvatarFallback>
                        {{ notification.user.charAt(0) }}
                      </span>
                    </hlm-avatar>

                    <div class="flex-1">
                      <div class="text-sm">
                        <span class="font-medium">{{ notification.user }}</span>
                        {{ t('actions.' + notification.action) }}
                        <span class="font-medium">{{ t('subjects.' + notification.subject) }}.</span>
                        @if (notification.unread) {
                          <span class="sr-only">({{ t('unread') }})</span>
                        }
                      </div>
                      <div class="text-muted-foreground text-xs">{{ notification.date | timeAgo }}</div>
                    </div>
                  </button>
                  <div class="flex flex-col items-center gap-3 self-center">
                    <button
                      type="button"
                      class="focus-visible:ring-ring rounded-xs text-xs hover:underline focus-visible:ring-2 focus-visible:outline-none"
                      (click)="onClear($index)"
                    >
                      <span class="sr-only">{{ t('dismiss') }}</span>
                      <ng-icon name="lucideX" />
                    </button>
                  </div>
                </div>
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
