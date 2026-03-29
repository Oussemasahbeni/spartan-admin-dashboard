import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideListFilter, lucideSearch } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { USER_STATUSES, UserStatus } from '../../../../shared/models/user';

@Component({
  selector: 'adm-users-status-filter',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmPopoverImports,
    BrnCommandImports,
    HlmCommandImports,
    HlmCheckboxImports,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideSearch, lucideListFilter })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover
      *transloco="let t"
      sideOffset="5"
      closeDelay="100"
      align="start"
      [state]="_statusState()"
      (stateChanged)="statusStateChanged($event)"
    >
      <button type="button" hlmBtn hlmPopoverTrigger variant="outline" size="sm" class="border-dashed">
        <ng-icon hlm name="lucideListFilter" size="sm" />
        {{ t('users.list.columns.status') }}
        @if (_statusFilter().length) {
          <div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-px shrink-0"></div>

          <div class="flex gap-1">
            @for (status of _statusFilter(); track status) {
              <span *transloco="let t" class="bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
                {{ t('users.status.' + status) }}
              </span>
            }
          </div>
        }
      </button>
      <hlm-command *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-50 p-0">
        <hlm-command-input>
          <ng-icon hlm name="lucideSearch" class="text-muted-foreground" />
          <input hlm-command-search-input [placeholder]="t('users.list.columns.status')" />
        </hlm-command-input>
        <div *brnCommandEmpty hlmCommandEmpty>
          {{ t('common.noData') }}
        </div>
        <hlm-command-list>
          <hlm-command-group>
            @for (status of _statusList(); track status) {
              <button type="button" hlm-command-item [value]="status" (selected)="statusSelected(status)">
                <hlm-checkbox class="mr-2" [checked]="isStatusSelected(status)" />
                @switch (status) {
                  @case ('active') {
                    <ng-icon hlmIcon size="xs" class="text-green-600" name="lucideCircleCheck" />
                  }
                  @case ('inactive') {
                    <ng-icon hlmIcon size="xs" class="text-destructive" name="lucideCircleX" />
                  }
                  @case ('pending') {
                    <ng-icon hlmIcon size="xs" class="text-yellow-600" name="lucideLoader" />
                  }
                }
                <span *transloco="let t; prefix: 'users.status'"> {{ t(status) }} </span>
              </button>
            }
            @if (_statusFilter().length) {
              <hlm-command-separator />
              <button
                type="button"
                hlm-command-item
                class="mt-1 flex justify-center"
                [value]="''"
                (selected)="clearStatusFilter()"
              >
                {{ t('common.clearFilter') }}
              </button>
            }
          </hlm-command-group>
        </hlm-command-list>
      </hlm-command>
    </hlm-popover>
  `,
})
export class StatusFilter {
  // ==========================================
  // Outputs
  // ==========================================

  public readonly statusChanged = output<UserStatus[]>();

  // ==========================================
  // State
  // ==========================================

  protected readonly _statusFilter = signal<UserStatus[]>([]);
  protected readonly _statusList = signal([...USER_STATUSES]);
  protected readonly _statusState = signal<'closed' | 'open'>('closed');

  // ==========================================
  // Public Methods
  // ==========================================

  protected clearStatusFilter(): void {
    this._statusFilter.set([]);
    this.statusChanged.emit(this._statusFilter());
  }

  protected statusStateChanged(state: 'open' | 'closed') {
    this._statusState.set(state);
  }

  protected isStatusSelected(status: UserStatus): boolean {
    return this._statusFilter().some((s) => s === status);
  }
  protected statusSelected(status: UserStatus): void {
    const current = this._statusFilter();
    const index = current.indexOf(status);
    if (index === -1) {
      this._statusFilter.set([...current, status]);
    } else {
      this._statusFilter.set(current.filter((s) => s !== status));
    }
    this.statusChanged.emit(this._statusFilter());
  }
}
