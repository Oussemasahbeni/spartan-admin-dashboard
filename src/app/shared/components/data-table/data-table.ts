import { ChangeDetectionStrategy, Component, computed, input, signal, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  createAngularTable,
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
import { TableResizableCell, TableResizableHeader } from '../../directives/resizable-cell';
import { DataTablePagination } from '../pagination/pagination';

@Component({
  selector: 'adm-data-table',
  imports: [
    HlmTableImports,
    HlmIconImports,
    HlmSpinnerImports,
    FlexRenderDirective,
    FormsModule,
    TranslocoDirective,
    DataTablePagination,
    TableResizableCell,
    TableResizableHeader,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  providers: [
    provideIcons({
      lucideChevronDown,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  readonly columns = input.required<ColumnDef<T>[]>();
  readonly isLoading = input<boolean>(false);
  readonly data = input<T[]>([]);
  readonly paginated  = input<boolean>(true);
  readonly resizableColumns = input<boolean>(false);
  readonly enableRowSelection = input<boolean>(false);

  private readonly _columnOrder = signal<string[]>([]);
  private readonly _columnFilters = signal<ColumnFiltersState>([]);
  private readonly _sorting = signal<SortingState>([]);
  private readonly _rowSelection = signal<RowSelectionState>({});
  private readonly _columnVisibility = signal<VisibilityState>({});
  readonly _columnSizingInfo = computed(() => this.table.getState().columnSizingInfo);
  readonly _columnSizing = computed(() => this.table.getState().columnSizing);
  /** Current pagination state (page index and size) */
  private readonly _pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  readonly table = createAngularTable<T>(() => ({
    data: this.data(),
    columns: this.columns(),
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

  protected onSort(column: Column<T, unknown>) {
    column.toggleSorting(column.getIsSorted() === 'asc');
  }
}
