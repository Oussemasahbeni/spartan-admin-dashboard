import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideBriefcase,
  lucideChevronDown,
  lucideCircleCheck,
  lucideCircleX,
  lucideGripVertical,
  lucideLoader,
  lucideRefreshCcw,
  lucideSettings2,
  lucideShieldCheck,
  lucideUser,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  flexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table';
import { User } from '../../core/user/user.type';
import { ActionDropdown } from './action-dropdown';
import { DashboardCardSection } from './card-section';
import { TableHeadSelection, TableRowSelection } from './selection-column';

import { translateSignal } from '@jsverse/transloco';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { UserService } from '../../core/user/user.service';
import { DataTablePagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-users',
  imports: [
    DatePipe,
    FlexRenderDirective,
    FormsModule,
    HlmDropdownMenuImports,
    HlmButtonImports,
    HlmIconImports,
    HlmInputImports,
    BrnSelectImports,
    HlmSelectImports,
    HlmTableImports,
    HlmLabelImports,
    HlmAvatarImports,
    HlmSpinnerImports,
    HlmBadgeImports,
    DashboardCardSection,
    TranslocoModule,
    DragDropModule,
    DataTablePagination,
  ],
  templateUrl: './users-list.html',
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideSettings2,
      lucideCircleCheck,
      lucideLoader,
      lucideCircleX,
      lucideArrowUpDown,
      lucideUser,
      lucideBriefcase,
      lucideShieldCheck,
      lucideRefreshCcw,
      lucideUserPlus,
      lucideGripVertical,
    }),
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  private readonly _userService = inject(UserService);

  readonly dateCell = viewChild.required('dateCell');
  readonly nameCell = viewChild.required('nameCell');
  readonly statusCell = viewChild.required('statusCell');
  readonly roleCell = viewChild.required('roleCell');

  private readonly _columnOrder = signal<string[]>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});
  protected readonly hidableColumns = computed(() => {
    this._columnOrder();
    this._columnVisibility();

    return this.table.getAllLeafColumns().filter((col) => col.getCanHide());
  });

  protected readonly _columns: ColumnDef<User>[] = [
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
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: translateSignal(`users.list.columns.name`),
      cell: () => this.nameCell(),
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: translateSignal(`users.list.columns.email`),
    },
    {
      id: 'phoneNumber',
      accessorKey: 'phoneNumber',
      header: translateSignal('users.list.columns.phoneNumber'),
      enableSorting: false,
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: translateSignal('users.list.columns.createdAt'),
      cell: () => this.dateCell(),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: translateSignal('users.list.columns.role'),
      cell: () => this.roleCell(),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: translateSignal('users.list.columns.status'),
      cell: () => this.statusCell(),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
  ];

  private readonly _pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  protected readonly table = createAngularTable<User>(() => ({
    data: this._userService.users(),
    columns: this._columns,
    state: {
      pagination: this._pagination(),
      columnOrder: this._columnOrder(),
      sorting: this._sorting(),
      columnFilters: this._columnFilters(),
      columnVisibility: this._columnVisibility(),
      rowSelection: this._rowSelection(),
    },

    onSortingChange: (updater) => {
      updater instanceof Function ? this._sorting.update(updater) : this._sorting.set(updater);
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function ? this._columnFilters.update(updater) : this._columnFilters.set(updater);
    },
    onPaginationChange: (updaterOrValue) => {
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(this._pagination()) : updaterOrValue;
      this._pagination.set(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function ? this._columnVisibility.update(updater) : this._columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function ? this._rowSelection.update(updater) : this._rowSelection.set(updater);
    },
    onColumnOrderChange: (updater) => {
      updater instanceof Function ? this._columnOrder.update(updater) : this._columnOrder.set(updater);
    },
  }));

  protected _filterChange(email: Event) {
    const target = email.target as HTMLInputElement;
    const typedValue = target.value;
    this.table.setGlobalFilter(typedValue);
  }
  protected _filterChanged(event: Event) {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }

  protected onDrop(event: CdkDragDrop<string[]>) {
    const hidableIds = this.hidableColumns().map((c) => c.id);

    moveItemInArray(hidableIds, event.previousIndex, event.currentIndex);

    this.table.setColumnOrder(['select', ...hidableIds, 'actions']);
  }

  protected onSort(column: Column<User, unknown>) {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }

  protected createUser() {
    // Logic to create a new user
  }
  protected refreshTable() {
    this.table.reset();
  }
}
