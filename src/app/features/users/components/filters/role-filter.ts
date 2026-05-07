import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideBriefcase, lucideListFilter, lucideSearch, lucideShieldCheck, lucideUser } from '@ng-icons/lucide';
import { BrnCommandImports } from '@spartan-ng/brain/command';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { USER_ROLES, UserRole } from '../../../../shared/models/user';

@Component({
  selector: 'adm-users-role-filter',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmPopoverImports,
    BrnCommandImports,
    HlmCommandImports,
    HlmCheckboxImports,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideSearch, lucideListFilter, lucideUser, lucideBriefcase, lucideShieldCheck })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-popover
      *transloco="let t"
      sideOffset="5"
      closeDelay="100"
      align="start"
      [state]="_rolesState()"
      (stateChanged)="rolesStateChanged($event)"
    >
      <button type="button" hlmBtn hlmPopoverTrigger variant="outline" size="sm" class="border-dashed">
        <ng-icon hlm name="lucideListFilter" size="sm" />
        {{ t('users.list.columns.role') }}
        @if (_rolesFilter().length) {
          <div data-orientation="vertical" role="none" class="bg-border mx-2 h-4 w-px shrink-0"></div>

          <div class="flex gap-1">
            @for (role of _rolesFilter(); track role) {
              <span *transloco="let t" class="bg-secondary text-secondary-foreground rounded px-1 py-0.5 text-xs">
                {{ t('users.role.' + role) }}
              </span>
            }
          </div>
        }
      </button>
      <hlm-command *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-50 p-0">
        <hlm-command-input>
          <ng-icon hlm name="lucideSearch" class="text-muted-foreground" />
          <input hlm-command-search-input [placeholder]="t('users.list.columns.role')" />
        </hlm-command-input>
        <div *brnCommandEmpty hlmCommandEmpty>
          {{ t('common.noData') }}
        </div>
        <hlm-command-list>
          <hlm-command-group>
            @for (role of _rolesList(); track role) {
              <button type="button" hlm-command-item [value]="role" (selected)="roleSelected(role)">
                <hlm-checkbox class="mr-2" [checked]="isRoleSelected(role)" />
                @switch (role) {
                  @case ('admin') {
                    <ng-icon hlmIcon size="sm" name="lucideShieldCheck" />
                  }
                  @case ('user') {
                    <ng-icon hlmIcon size="sm" name="lucideUser" />
                  }
                  @case ('manager') {
                    <ng-icon hlmIcon size="sm" name="lucideBriefcase" />
                  }
                }
                <span *transloco="let t; prefix: 'users.role'"> {{ t(role) }} </span>
              </button>
            }
            @if (_rolesFilter().length) {
              <hlm-command-separator />
              <button
                type="button"
                hlm-command-item
                class="mt-1 flex justify-center"
                [value]="''"
                (selected)="clearRolesFilter()"
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
export class RoleFilter {
  // ==========================================
  // Outputs
  // ==========================================

  public readonly rolesChanged = output<UserRole[]>();

  // ==========================================
  // State
  // ==========================================

  protected readonly _rolesFilter = signal<UserRole[]>([]);
  protected readonly _rolesList = signal([...USER_ROLES]);
  protected readonly _rolesState = signal<'closed' | 'open'>('closed');

  // ==========================================
  // Public Methods
  // ==========================================

  protected rolesStateChanged(state: 'open' | 'closed') {
    this._rolesState.set(state);
  }

  protected isRoleSelected(role: UserRole): boolean {
    return this._rolesFilter().some((r) => r === role);
  }

  protected roleSelected(role: UserRole): void {
    const current = this._rolesFilter();
    const index = current.indexOf(role);
    if (index === -1) {
      this._rolesFilter.set([...current, role]);
    } else {
      this._rolesFilter.set(current.filter((r) => r !== role));
    }
    this.rolesChanged.emit(this._rolesFilter());
  }

  protected clearRolesFilter(): void {
    this._rolesFilter.set([]);
    this.rolesChanged.emit(this._rolesFilter());
  }
}
