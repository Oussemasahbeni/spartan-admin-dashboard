import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideBriefcase,
  lucideChevronDown,
  lucideCircleCheck,
  lucideCirclePlus,
  lucideCircleX,
  lucideDownload,
  lucideFileUp,
  lucideGripVertical,
  lucideLoader,
  lucideRefreshCcw,
  lucideSearch,
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

import { toSignal } from '@angular/core/rxjs-interop';
import { translateSignal } from '@jsverse/transloco';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmDialogService } from '@spartan-ng/helm/dialog';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { UserService } from '../../../core/user/user.service';
import { User, UserRole, UserStatus } from '../../../core/user/user.type';
import { CountryDisplay } from '../../../shared/components/country-display/country-display';
import { DataTablePagination } from '../../../shared/components/pagination/pagination';
import { TableResizableCell, TableResizableHeader } from '../../../shared/directives/resizable-cell';
import { UserForm } from '../form/user-form';
import { RoleIconPipe } from '../pipes/role-icon.pipe';
import { StatusUIPipe } from '../pipes/status-ui.pipe';
import { ActionDropdown } from './action-dropdown';
import { CardSection } from './card-section';
import { TableHeadSelection, TableRowSelection } from './selection-column';

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
    HlmPopoverImports,
    BrnPopoverImports,
    BrnCommandImports,
    HlmCommandImports,
    HlmCheckboxImports,
    CardSection,
    TranslocoModule,
    DragDropModule,
    DataTablePagination,
    RoleIconPipe,
    StatusUIPipe,
    CountryDisplay,
    TableResizableCell,
    TableResizableHeader,
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
      lucideDownload,
      lucideFileUp,
      lucideCirclePlus,
      lucideSearch,
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
  readonly dateCell = viewChild.required('dateCell');
  readonly nameCell = viewChild.required('nameCell');
  readonly statusCell = viewChild.required('statusCell');
  readonly roleCell = viewChild.required('roleCell');
  readonly countryCell = viewChild.required('countryCell');

  /** Signal tracking the current active language for i18n updates */
  protected readonly currentLang = toSignal(this._translocoService.langChanges$, {
    initialValue: this._translocoService.getActiveLang(),
  });

  // --- Filter & UI State ---
  protected readonly _statusFilter = signal<UserStatus[]>([]);
  protected readonly _statusList = signal(['active', 'inactive', 'pending'] satisfies UserStatus[]);
  protected readonly _statusState = signal<'closed' | 'open'>('closed');

  protected readonly _rolesFilter = signal<UserRole[]>([]);
  protected readonly _rolesList = signal(['admin', 'user', 'manager'] satisfies UserRole[]);
  protected readonly _rolesState = signal<'closed' | 'open'>('closed');

  // --- Table State  ---
  private readonly _columnOrder = signal<string[]>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});
  readonly _columnSizingInfo = computed(() => this.table.getState().columnSizingInfo);
  readonly _columnSizing = computed(() => this.table.getState().columnSizing);

  /**
   *
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  readonly columnSizeVars = computed(() => {
    void this._columnSizing();
    void this._columnSizingInfo();
    const headers = untracked(() => this.table.getFlatHeaders());
    const colSizes: Record<string, number> = {};
    let i = headers.length;
    while (--i >= 0) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  });

  /**
   * Computed list of columns that are eligible for being hidden.
   * Filters out columns with `enableHiding: false`.
   */
  protected readonly hidableColumns = computed(() => {
    this._columnOrder();
    this._columnVisibility();

    return this.table.getAllLeafColumns().filter((col) => col.getCanHide());
  });

  /**
   * TanStack Table Column Definitions.
   * Uses `translateSignal` for reactive header translations.
   */
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

  /** Current pagination state (page index and size) */
  private readonly _pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  /**
   * Core TanStack Table instance.
   * Manages data processing, sorting, filtering, and pagination logic.
   */
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
    columnResizeMode: 'onChange',
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

  /**
   * Updates the global table filter based on input search text.
   * @param event The input event from the search field.
   */
  protected _filterChange(email: Event) {
    const target = email.target as HTMLInputElement;
    const typedValue = target.value;
    this.table.setGlobalFilter(typedValue);
  }
  protected _filterChanged(event: Event) {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }

  protected onSort(column: Column<User, unknown>) {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }

  protected addUser() {
    this._hlmDialogService.open(UserForm, {
      contentClass: 'max-w-3xl',
      autoFocus: 'dialog',
    });
  }

  protected refreshTable() {
    this.table.reset();
  }

  /**
   * Handles column reordering via CDK Drag and Drop.
   * @param event The drag-drop event containing previous and current index.
   */
  protected onDrop(event: CdkDragDrop<string[]>) {
    const hidableIds = this.hidableColumns().map((c) => c.id);

    moveItemInArray(hidableIds, event.previousIndex, event.currentIndex);

    this.table.setColumnOrder(['select', ...hidableIds, 'actions']);
  }

  // --- Role Filter Methods ---
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
    this.table.getColumn('role')?.setFilterValue(this._rolesFilter());
  }
  protected clearRolesFilter(): void {
    this._rolesFilter.set([]);
    this.table.getColumn('role')?.setFilterValue([]);
  }

  // --- Status Filter Methods ---
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
    this.table.getColumn('status')?.setFilterValue(this._statusFilter());
  }

  protected clearStatusFilter(): void {
    this._statusFilter.set([]);
    this.table.getColumn('status')?.setFilterValue([]);
  }
}
