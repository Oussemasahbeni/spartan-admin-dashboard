import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { translateSignal, TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import {
  CellContext,
  ColumnPinningState,
  createColumnHelper,
  flexRenderComponent,
  PaginationState,
  SortingState,
} from '@tanstack/angular-table';

import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounce, form, FormField } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
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
import { DataTable } from '@shared/datatable/table/data-table';
import { DataTableFeatures } from '@shared/datatable/table/table-features';
import { HlmDialogService } from '@spartan-ng/helm/dialog';

import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { User, UserRole, UserStatus } from '../../../shared/models/user';
import { UsersCardSection } from '../components/cards/card-section';
import { RoleFilter } from '../components/filters/role-filter';
import { StatusFilter } from '../components/filters/status-filter';
import { UserForm } from '../components/form/user-form';
import { ActionDropdown } from '../components/table/action-dropdown';
import { UserService } from '../service/user-service';

@Component({
  selector: 'adm-users',
  imports: [
    HlmButtonImports,
    NgIcon,
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
  private readonly _userService = inject(UserService);

  // ==========================================
  // View Children
  // ==========================================

  /**
   * Template references for custom cell rendering.
   * These are accessed via viewChild and passed to TanStack column definitions.
   */
  protected readonly dataTable = viewChild.required(DataTable<User>);
  protected readonly dateCell = viewChild.required<TemplateRef<CellContext<DataTableFeatures, User, string>>>('dateCell');
  protected readonly nameCell = viewChild.required<TemplateRef<CellContext<DataTableFeatures, User, string>>>('nameCell');
  protected readonly statusCell =
    viewChild.required<TemplateRef<CellContext<DataTableFeatures, User, UserStatus>>>('statusCell');
  protected readonly roleCell = viewChild.required<TemplateRef<CellContext<DataTableFeatures, User, string>>>('roleCell');
  protected readonly countryCell =
    viewChild.required<TemplateRef<CellContext<DataTableFeatures, User, string>>>('countryCell');

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  protected readonly sorting = signal<SortingState>([]);
  protected readonly selectedRoles = signal<UserRole[]>([]);
  protected readonly selectedStatuses = signal<UserStatus[]>([]);
  protected readonly defaultColumnPinning: ColumnPinningState = { start: ['select'], end: ['actions'] };

  protected readonly userRowId = (user: User) => user.id;
  protected readonly usersResource = rxResource({
    params: () => {
      const sort = this.sorting()[0];
      return {
        page: this.pagination().pageIndex,
        pageSize: this.pagination().pageSize,
        search: this.searchForm.search().value(),
        sortField: (sort?.id ?? '') as keyof User | '',
        sortOrder: (sort?.desc ? 'desc' : 'asc') as 'asc' | 'desc',
        roles: this.selectedRoles(),
        statuses: this.selectedStatuses(),
      };
    },
    stream: ({ params }) => this._userService.getUsers(params),
  });

  protected readonly activeLanguage = computed(() => this._translocoService.activeLang());
  protected readonly searchForm = form(signal({ search: '' }), (schema) => debounce(schema.search, 300));

  private readonly columnHelper = createColumnHelper<DataTableFeatures, User>();

  protected readonly columns = this.columnHelper.columns([
    this.columnHelper.accessor('name', {
      header: translateSignal(`list.columns.name`),
      meta: () => ({ translationKey: 'users.list.columns.name' }),
      cell: () => this.nameCell(),
    }),
    this.columnHelper.accessor('email', {
      header: translateSignal(`list.columns.email`),
      meta: () => ({ translationKey: 'users.list.columns.email' }),
    }),
    this.columnHelper.accessor('country', {
      header: translateSignal('list.columns.country'),
      meta: () => ({ translationKey: 'users.list.columns.country' }),
      enableSorting: false,
      cell: () => this.countryCell(),
    }),
    this.columnHelper.accessor('phoneNumber', {
      header: translateSignal('list.columns.phoneNumber'),
      meta: () => ({ translationKey: 'users.list.columns.phoneNumber' }),
      enableSorting: false,
    }),
    this.columnHelper.accessor('createdAt', {
      header: translateSignal('list.columns.createdAt'),
      meta: () => ({ translationKey: 'users.list.columns.createdAt' }),
      cell: () => this.dateCell(),
    }),

    this.columnHelper.accessor('role', {
      header: translateSignal('list.columns.role'),
      meta: () => ({ translationKey: 'users.list.columns.role' }),
      cell: () => this.roleCell(),
    }),
    this.columnHelper.accessor('status', {
      header: translateSignal('list.columns.status'),
      meta: () => ({ translationKey: 'users.list.columns.status' }),
      cell: () => this.statusCell(),
    }),

    this.columnHelper.display({
      id: 'actions',
      enableHiding: false,
      enableResizing: false,
      enablePinning: true,
      size: 40,
      cell: (context) =>
        flexRenderComponent(ActionDropdown, {
          inputs: {
            row: context.row,
            onSuccess: () => this.refreshTable(),
          },
        }),
    }),
  ]);

  // ==========================================
  // Public Methods
  // ==========================================

  protected addUser() {
    const dialogRef = this._hlmDialogService.open(UserForm, {
      autoFocus: false,
      contentClass: 'sm:min-w-lg',
    });

    dialogRef.closed$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((result) => {
      if (result) this.refreshTable();
    });
  }

  // ==========================================
  // Private Methods
  // ==========================================

  protected refreshTable(): void {
    this.usersResource.reload();
  }
}
