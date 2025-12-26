import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronFirst,
  lucideChevronLast,
  lucideChevronLeft,
  lucideChevronRight,
  lucideSettings2,
} from '@ng-icons/lucide';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
  flexRenderComponent,
  FlexRenderDirective,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table';
import { ActionDropdown } from './action-dropdown';
import { DashboardCardSection } from './card-section';
import { USER_DATA } from './data';
import { TableHeadSelection, TableRowSelection } from './selection-column';
import { TableHeadSortButton } from './sort-header-button';
import { StatusCell } from './status';
import { User } from './user-type';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}
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
    DashboardCardSection,
  ],
  templateUrl: './users-list.html',
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideChevronFirst,
      lucideChevronLast,
      lucideChevronRight,
      lucideChevronLeft,
      lucideSettings2,
    }),
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users {
  readonly dateCell = viewChild.required('dateCell');
  protected readonly _availablePageSizes = [5, 10, 20, 10000];

  protected _filterChanged(event: Event) {
    this._table
      .getColumn('email')
      ?.setFilterValue((event.target as HTMLInputElement).value);
  }

  protected readonly _columns: ColumnDef<User>[] = [
    {
      id: 'select',
      header: () =>
        flexRenderComponent(TableHeadSelection, { inputs: { header: '' } }),
      cell: () =>
        flexRenderComponent(TableRowSelection, { inputs: { header: '' } }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      id: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'email',
      id: 'email',
      header: () =>
        flexRenderComponent(TableHeadSortButton, {
          inputs: { header: 'Email' },
        }),
    },
    {
      accessorKey: 'phoneNumber',
      id: 'phoneNumber',
      header: 'Phone Number',
    },
    {
      accessorKey: 'createdAt',
      id: 'createdAt',
      header: 'Created At',
      cell: () => this.dateCell(),
    },
    {
      accessorKey: 'role',
      id: 'role',
      header: 'Role',
      cell: (info) =>
        `<span class="capitalize">${info.getValue<string>()}</span>`,
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: 'Status',
      enableSorting: false,
      cell: () => flexRenderComponent(StatusCell),
    },

    {
      id: 'actions',
      enableHiding: false,
      cell: () => flexRenderComponent(ActionDropdown),
    },
  ];

  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});

  protected readonly _table = createAngularTable<User>(() => ({
    data: USER_DATA,
    columns: this._columns,
    onSortingChange: (updater) => {
      updater instanceof Function
        ? this._sorting.update(updater)
        : this._sorting.set(updater);
    },
    onColumnFiltersChange: (updater) => {
      updater instanceof Function
        ? this._columnFilters.update(updater)
        : this._columnFilters.set(updater);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function
        ? this._columnVisibility.update(updater)
        : this._columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function
        ? this._rowSelection.update(updater)
        : this._rowSelection.set(updater);
    },
    state: {
      sorting: this._sorting(),
      columnFilters: this._columnFilters(),
      columnVisibility: this._columnVisibility(),
      rowSelection: this._rowSelection(),
    },
  }));
  protected readonly _hidableColumns = this._table
    .getAllColumns()
    .filter((column) => column.getCanHide());

  protected _filterChange(email: Event) {
    const target = email.target as HTMLInputElement;
    const typedValue = target.value;
    this._table.setGlobalFilter(typedValue);
  }
}
