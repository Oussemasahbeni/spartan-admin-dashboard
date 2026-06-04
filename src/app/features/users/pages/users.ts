import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import {
  CellContext,
  ColumnDef,
  ColumnPinningState,
  flexRenderComponent,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table';

import { httpResource } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { translateSignal } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBriefcase,
  lucideCircleCheck,
  lucideCircleX,
  lucideLoader,
  lucideRefreshCcw,
  lucideSearch,
  lucideShieldCheck,
  lucideUser,
  lucideUserPlus,
  lucideX,
} from '@ng-icons/lucide';
import { CountryDisplay } from '@shared/components/country-display/country-display';
import { DataTableColumnsManager } from '@shared/datatable/columns-manager/columns-manager';
import { DataTable, DataTableStateChangeEvent } from '@shared/datatable/table/data-table';
import { PaginatedResponse } from '@shared/models/page';
import { HlmDialogService } from '@spartan-ng/helm/dialog';

import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { User, UserRole, UserStatus } from '../../../shared/models/user';
import { UsersCardSection } from '../components/cards/card-section';
import { RoleFilter } from '../components/filters/role-filter';
import { StatusFilter } from '../components/filters/status-filter';
import { UserForm } from '../components/form/user-form';
import { ActionDropdown } from '../components/table/action-dropdown';

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
    CountryDisplay,
    DataTable,
    DataTableColumnsManager,
    StatusFilter,
    RoleFilter,
    FormField,
  ],
  templateUrl: './users.html',
  providers: [
    provideIcons({
      lucideRefreshCcw,
      lucideUserPlus,
      lucideSearch,
      lucideX,
      lucideCircleCheck,
      lucideCircleX,
      lucideLoader,
      lucideBriefcase,
      lucideShieldCheck,
      lucideUser,
    }),
  ],
})
export default class Users {
  // ==========================================
  // Services
  // ==========================================

  private readonly _translocoService = inject(TranslocoService);
  private readonly _hlmDialogService = inject(HlmDialogService);
  private readonly _destroyRef = inject(DestroyRef);

  // ==========================================
  // View Children
  // ==========================================

  /**
   * Template references for custom cell rendering.
   * These are accessed via viewChild and passed to TanStack column definitions.
   */
  protected readonly dataTable = viewChild.required(DataTable<User>);
  protected readonly dateCell = viewChild.required<TemplateRef<CellContext<User, string>>>('dateCell');
  protected readonly nameCell = viewChild.required<TemplateRef<CellContext<User, string>>>('nameCell');
  protected readonly statusCell = viewChild.required<TemplateRef<CellContext<User, UserStatus>>>('statusCell');
  protected readonly roleCell = viewChild.required<TemplateRef<CellContext<User, string>>>('roleCell');
  protected readonly countryCell = viewChild.required<TemplateRef<CellContext<User, string>>>('countryCell');

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  protected readonly sorting = signal<SortingState>([]);
  protected readonly selectedRoles = signal<UserRole[]>([]);
  protected readonly selectedStatuses = signal<UserStatus[]>([]);
  protected readonly defaultColumnPinning: ColumnPinningState = { left: ['select'], right: ['actions'] };

  protected readonly usersResource = httpResource<PaginatedResponse<User>>(() => {
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

  protected readonly activeLanguage = computed(() => this._translocoService.activeLang());
  protected readonly searchForm = form(signal({ search: '' }), (schema) => debounce(schema.search, 300));
  protected readonly columns: ColumnDef<User>[] = [
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
      enablePinning: true,
      size: 40,
      cell: () =>
        flexRenderComponent(ActionDropdown, {
          inputs: {
            onSuccess: () => this.refreshTable(),
          },
        }),
    },
  ];

  // ==========================================
  // Public Methods
  // ==========================================

  protected addUser() {
    const dialogRef = this._hlmDialogService.open(UserForm);

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) this.refreshTable();
    });
  }

  protected handleStateChange(state: DataTableStateChangeEvent) {
    this.pagination.set(state.pagination);
    this.sorting.set(state.sorting);
  }

  // ==========================================
  // Private Methods
  // ==========================================

  refreshTable(): void {
    this.usersResource.reload();
  }
}
