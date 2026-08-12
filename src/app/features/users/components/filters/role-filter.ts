import { Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBriefcase, lucideListFilter, lucideSearch, lucideShieldCheck, lucideUser } from '@ng-icons/lucide';
import { USER_ROLES, UserRole } from '@shared/models/user';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCommandImports } from '@spartan-ng/helm/command';

import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';

@Component({
  selector: 'adm-users-role-filter',
  imports: [
    HlmButtonImports,
    HlmBadgeImports,
    HlmSeparatorImports,
    NgIcon,
    HlmPopoverImports,
    BrnCommandImports,
    HlmCommandImports,
    HlmCheckboxImports,
    TranslocoModule,
  ],
  providers: [provideIcons({ lucideSearch, lucideListFilter, lucideUser, lucideBriefcase, lucideShieldCheck })],

  template: `
    <hlm-popover
      *transloco="let t"
      sideOffset="5"
      closeDelay="100"
      align="start"
      [state]="_rolesState()"
      (stateChanged)="rolesStateChanged($event)"
    >
      <button type="button" hlmBtn hlmPopoverTrigger variant="outline" class="border-dashed">
        <ng-icon name="lucideListFilter" />
        {{ t('users.list.columns.role') }}
        @if (_rolesFilter().length) {
          <hlm-separator class="mx-2" orientation="vertical" />
          <div class="flex gap-1">
            @for (role of _rolesFilter(); track role) {
              <span *transloco="let t" hlmBadge>
                {{ t('users.role.' + role) }}
              </span>
            }
          </div>
        }
      </button>
      <hlm-command *hlmPopoverPortal="let ctx" hlmPopoverContent class="w-50 p-0">
        <hlm-command-input>
          <ng-icon name="lucideSearch" class="text-muted-foreground" />
          <input hlm-command-search-input [placeholder]="t('users.list.columns.role')" />
        </hlm-command-input>
        <div *brnCommandEmpty hlmCommandEmpty>
          {{ t('common.noData') }}
        </div>
        <hlm-command-list>
          <hlm-command-group>
            @for (role of _rolesList(); track role) {
              <button type="button" hlm-command-item [value]="role" (selected)="roleSelected(role)">
                <hlm-checkbox [checked]="isRoleSelected(role)" />
                @switch (role) {
                  @case ('admin') {
                    <ng-icon name="lucideShieldCheck" />
                  }
                  @case ('user') {
                    <ng-icon name="lucideUser" />
                  }
                  @case ('manager') {
                    <ng-icon name="lucideBriefcase" />
                  }
                  @default never;
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
