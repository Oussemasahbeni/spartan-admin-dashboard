import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleCheck,
  lucideCircleX,
  lucideLoader,
} from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmIcon } from '@spartan-ng/helm/icon';
import {
  type CellContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';
import { User } from './user-type';

@Component({
  selector: 'status-cell',
  imports: [HlmBadge, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideCircleCheck, lucideLoader, lucideCircleX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      hlmBadge
      variant="outline"
      class="text-muted-foreground rounded-full px-1.5 text-xs"
      [id]="element.id + '-status'"
    >
      @if (element.status === 'active') {
      <ng-icon
        hlm
        name="lucideCircleCheck"
        class="text-green-500 dark:text-green-400"
        size="xs"
      />
      } @else if (element.status === 'inactive') {
      <ng-icon
        hlm
        name="lucideCircleX"
        class="text-red-500 dark:text-red-400"
        size="xs"
      />
      } @else {
      <ng-icon hlm name="lucideLoader" size="xs" />
      }
      <span class="capitalize"> {{ element.status }} </span>
    </span>
  `,
})
export class StatusCell {
  private readonly _context =
    injectFlexRenderContext<CellContext<User, unknown>>();
  protected readonly element = this._context.row.original;
}
