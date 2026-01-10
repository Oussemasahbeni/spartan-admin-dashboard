import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { CellContext, ColumnDef, flexRenderComponent, PaginationState, SortingState } from '@tanstack/angular-table';

import { httpResource } from '@angular/common/http';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { translateSignal } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideRefreshCcw, lucideSearch, lucideUserPlus, lucideX } from '@ng-icons/lucide';
import { DataTableColumnManager } from '@shared/components/columns-manager/data-table-column-manager';
import { CountryDisplay } from '@shared/components/country-display/country-display';
import { DataTable } from '@shared/components/data-table/data-table';
import { PaginatedResponse } from '@shared/models/page';
import { HlmDialogService } from '@spartan-ng/helm/dialog';

import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { UsersCardSection } from './components/cards/card-section';
import { RoleFilter } from './components/filters/role-filter';
import { StatusFilter } from './components/filters/status-filter';
import { UserForm } from './components/form/user-form';
import { ActionDropdown } from './components/table/action-dropdown';
import { TableHeadSelection, TableRowSelection } from './components/table/selection-column';
import { User, UserRole, UserStatus } from './model/user';
import { provideUserRoleIcons, RoleIconPipe } from './pipes/role-icon.pipe';
import { provideUserStatusIcons, StatusUIPipe } from './pipes/status-ui.pipe';

@Component({
  selector: 'adm-users',
  imports: [
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    HlmLabelImports,
    HlmInputGroupImports,
    HlmAvatarImports,
    HlmBadgeImports,
    DatePipe,
    UsersCardSection,
    TranslocoModule,
    RoleIconPipe,
    StatusUIPipe,
    CountryDisplay,
    DataTable,
    DataTableColumnManager,
    StatusFilter,
    RoleFilter,
    FormField,
  ],
  templateUrl: './users-list.html',
  providers: [
    provideUserStatusIcons(),
    provideUserRoleIcons(),
    provideIcons({
      lucideRefreshCcw,
      lucideUserPlus,
      lucideSearch,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private readonly _translocoService = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);

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

  protected readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  protected readonly sorting = signal<SortingState>([]);
  protected readonly selectedRoles = signal<UserRole[]>([]);
  protected readonly selectedStatuses = signal<UserStatus[]>([]);

  readonly usersResource = httpResource<PaginatedResponse<User>>(() => {
    const page = this.pagination().pageIndex;
    const size = this.pagination().pageSize;
    const search = this.searchForm.search().value();
    const sort = this.sorting()[0];
    const roles = this.selectedRoles();
    const statuses = this.selectedStatuses();

    return {
      url: '/api/users',
      params: {
        page: page.toString(),
        pageSize: size.toString(),
        search,
        sortField: sort?.id ?? '',
        sortOrder: sort?.desc ? 'desc' : 'asc',
        roles,
        statuses,
      },
    };
  });

  readonly users = computed(() => this.usersResource.value()?.content ?? []);
  readonly totalElements = computed(() => this.usersResource.value()?.total ?? 0);
  readonly isLoading = this.usersResource.isLoading;

  /** Signal tracking the current active language for i18n updates */
  protected readonly currentLang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  protected readonly searchForm = form(signal({ search: '' }), (schema) => debounce(schema.search, 300));

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
      size: 30,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: translateSignal(`list.columns.name`),
      meta: { translationKey: 'users.list.columns.name' },
      cell: () => this.nameCell(),
    },
    {
      id: 'email',
      accessorKey: 'email',
      meta: { translationKey: 'users.list.columns.email' },
      header: translateSignal(`list.columns.email`),
    },
    {
      id: 'country',
      accessorKey: 'country',
      header: translateSignal('list.columns.country'),
      meta: { translationKey: 'users.list.columns.country' },
      enableSorting: false,
      cell: () => this.countryCell(),
    },
    {
      id: 'phoneNumber',
      accessorKey: 'phoneNumber',
      header: translateSignal('list.columns.phoneNumber'),
      meta: { translationKey: 'users.list.columns.phoneNumber' },
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: translateSignal('list.columns.createdAt'),
      meta: { translationKey: 'users.list.columns.createdAt' },
      cell: () => this.dateCell(),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: translateSignal('list.columns.role'),
      meta: { translationKey: 'users.list.columns.role' },
      cell: () => this.roleCell(),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: translateSignal('list.columns.status'),
      meta: { translationKey: 'users.list.columns.status' },
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
      size: 40,
      cell: () =>
        flexRenderComponent(ActionDropdown, {
          inputs: {
            onSuccess: () => this.refreshTable(),
          },
        }),
    },
  ];

  protected addUser() {
    const dialogRef = this._hlmDialogService.open(UserForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) this.refreshTable();
    });
  }

  protected handleStateChange(state: { pagination: PaginationState; sorting: SortingState }) {
    this.pagination.set(state.pagination);
    this.sorting.set(state.sorting);
  }

  refreshTable(): void {
    this.usersResource.reload();
  }
}
