import { Component } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideAlertCircle,
  lucideInfo,
  lucideTrendingDown,
  lucideTrendingUp,
  lucideUserCheck2,
  lucideUserPlus,
  lucideUsers,
} from '@ng-icons/lucide';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'adm-users-card-section',
  imports: [HlmCardImports, NgIcon, HlmBadgeImports, HlmTooltipImports, TranslocoModule],
  providers: [
    provideIcons({
      lucideUsers,
      lucideUserPlus,
      lucideUserCheck2,
      lucideAlertCircle,
      lucideInfo,
      lucideTrendingUp,
      lucideTrendingDown,
    }),
    provideTranslocoScope('users'),
  ],
  template: `
    <div class="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <div *transloco="let t; prefix: 'users.cards.totalUsers'" class="border-border bg-card rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex gap-4">
            <ng-icon name="lucideUsers" class="text-muted-foreground" />
            <div>
              <p class="text-muted-foreground text-sm">{{ t('label') }}</p>
              <h3 class="text-3xl font-bold tabular-nums">{{ t('value') }}</h3>
              <p class="text-muted-foreground text-xs">{{ t('subtitle') }}</p>
            </div>
          </div>
          <ng-icon name="lucideInfo" class="text-muted-foreground" [hlmTooltip]="t('infoTooltip')" />
        </div>
      </div>
      <div *transloco="let t; prefix: 'users.cards.newUsers'" class="border-border bg-card rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex gap-4">
            <ng-icon name="lucideUserPlus" class="text-muted-foreground" />
            <div>
              <p class="text-muted-foreground text-sm">{{ t('label') }}</p>
              <h3 class="text-3xl font-bold tabular-nums">{{ t('value') }}</h3>
              <p class="text-muted-foreground text-xs">{{ t('subtitle') }}</p>
            </div>
          </div>
          <div hlmCardAction>
            <span hlmBadge variant="outline">
              <ng-icon class="text-success" name="lucideTrendingUp" />
              +10%
            </span>
          </div>
        </div>
      </div>
      <div
        *transloco="let t; prefix: 'users.cards.pendingVerifications'"
        class="border-border bg-card rounded-lg border p-6"
      >
        <div class="flex items-start justify-between">
          <div class="flex gap-4">
            <ng-icon name="lucideAlertCircle" class="text-muted-foreground" />
            <div>
              <p class="text-muted-foreground text-sm">{{ t('label') }}</p>
              <h3 class="text-3xl font-bold tabular-nums">{{ t('value') }}</h3>
              <p class="text-muted-foreground text-xs">{{ t('subtitle') }}</p>
            </div>
          </div>

          <div hlmCardAction>
            <span hlmBadge variant="outline">
              <ng-icon class="text-destructive" name="lucideTrendingDown" />
              -12.5%
            </span>
          </div>
        </div>
      </div>
      <div *transloco="let t; prefix: 'users.cards.activeUsers'" class="border-border bg-card rounded-lg border p-6">
        <div class="flex items-start justify-between">
          <div class="flex gap-4">
            <ng-icon name="lucideUserCheck2" class="text-muted-foreground" />
            <div>
              <p class="text-muted-foreground text-sm">{{ t('label') }}</p>
              <h3 class="text-3xl font-bold tabular-nums">{{ t('value') }}</h3>
              <p class="text-muted-foreground text-xs">{{ t('subtitle') }}</p>
            </div>
          </div>
          <div hlmCardAction>
            <span hlmBadge variant="outline">
              <ng-icon class="text-success" name="lucideTrendingUp" />
              +12.5%
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class UsersCardSection {}
