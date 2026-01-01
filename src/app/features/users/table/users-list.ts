import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, TemplateRef, viewChild } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { CellContext, ColumnDef, flexRenderComponent } from '@tanstack/angular-table';

import { toSignal } from '@angular/core/rxjs-interop';
import { translateSignal } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileUp, lucideRefreshCcw, lucideUserPlus } from '@ng-icons/lucide';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { UserService } from '../../../core/user/user.service';
import { CountryDisplay } from '../../../shared/components/country-display/country-display';
import { DataTable } from '../../../shared/components/data-table/data-table';
import { DataTableColumnManager } from '../../../shared/components/data-table/data-table-column-manager';
import { UserForm } from '../form/user-form';
import { User, UserStatus } from '../model/user';
import { provideUserRoleIcons, RoleIconPipe } from '../pipes/role-icon.pipe';
import { provideUserStatusIcons, StatusUIPipe } from '../pipes/status-ui.pipe';
import { ActionDropdown } from './action-dropdown';
import { CardSection } from './card-section';
import { RoleFilter } from './role-filter';
import { TableHeadSelection, TableRowSelection } from './selection-column';
import { StatusFilter } from './status-filter';

@Component({
  selector: 'adm-users',
  imports: [
    DatePipe,
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
    HlmAvatarImports,
    HlmBadgeImports,
    CardSection,
    TranslocoModule,
    RoleIconPipe,
    StatusUIPipe,
    CountryDisplay,
    DataTable,
    DataTableColumnManager,
    StatusFilter,
    RoleFilter,
  ],
  templateUrl: './users-list.html',
  providers: [
    provideUserStatusIcons(),
    provideUserRoleIcons(),
    provideIcons({
      lucideRefreshCcw,
      lucideUserPlus,
      lucideDownload,
      lucideFileUp,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  // --- Services ---
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);

  /**
   * Template references for custom cell rendering.
   * These are accessed via viewChild and passed to TanStack column definitions.
   */
  readonly dataTable = viewChild.required(DataTable<User>);
  readonly dateCell = viewChild.required<TemplateRef<CellContext<User, string>>>('dateCell');
  readonly nameCell = viewChild.required<TemplateRef<CellContext<User, string>>>('nameCell');
  readonly statusCell = viewChild.required<TemplateRef<CellContext<User, UserStatus>>>('statusCell');
  readonly roleCell = viewChild.required<TemplateRef<CellContext<User, string>>>('roleCell');
  readonly countryCell = viewChild.required<TemplateRef<CellContext<User, string>>>('countryCell');

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly isLoading = computed(() => this._userService.isLoading());

  readonly users = this._userService.users;

  /** Signal tracking the current active language for i18n updates */
  protected readonly currentLang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  /**
   * TanStack Table Column Definitions.
   * Uses `translateSignal` for reactive header translations.
   */
  protected readonly columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: () =>
        flexRenderComponent(TableHeadSelection, {
          inputs: { header: '' },
        }),
      cell: () =>
        flexRenderComponent(TableRowSelection, {
          inputs: { header: '' },
        }),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 40,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: translateSignal(`list.columns.name`),
      cell: () => this.nameCell(),
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: translateSignal(`list.columns.email`),
    },
    {
      id: 'country',
      accessorKey: 'country',
      header: translateSignal('list.columns.country'),
      enableSorting: false,
      cell: () => this.countryCell(),
    },
    {
      id: 'phoneNumber',
      accessorKey: 'phoneNumber',
      header: translateSignal('list.columns.phoneNumber'),
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: translateSignal('list.columns.createdAt'),
      cell: () => this.dateCell(),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: translateSignal('list.columns.role'),
      cell: () => this.roleCell(),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: translateSignal('list.columns.status'),
      cell: () => this.statusCell(),
      filterFn: (row, columnId, filterValue: UserStatus[]) => {
        // If no filter is selected, show all rows
        if (!filterValue || filterValue.length === 0) {
          return true;
        }
        const rowValue = row.getValue(columnId) as UserStatus;
        return filterValue.includes(rowValue);
      },
    },

    {
      id: 'actions',
      enableHiding: false,
      enableResizing: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
  ];

  protected addUser() {
    this._hlmDialogService.open(UserForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });
  }

  refreshTable(): void {
    console.log('Refreshing table data...');
  }

  protected _filterChanged(event: Event) {
    this.table()
      .getColumn('email')
      ?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
