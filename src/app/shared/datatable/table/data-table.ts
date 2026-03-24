import { BooleanInput, NumberInput } from '@angular/cdk/coercion';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideSortAsc, lucideSortDesc, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
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
  SortDirection,
  SortingState,
  VisibilityState,
} from '@tanstack/angular-table';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { TableResizableCell, TableResizableHeader } from '../directives/resizable-cell';
import { DataTablePagination } from '../pagination/pagination';
import { toCssVarToken } from '../utils/css-var-token';

/**
 * A flexible data table component built on TanStack Table (Angular Table).
 * Supports both client-side and server-side pagination, sorting, and filtering.
 *
 * @example
 * **Client-side mode (default)** - All data in memory, table handles pagination/sorting:
 * ```html
 * <adm-data-table
 *   [columns]="columns"
 *   [data]="allItems()"
 *   [pageSize]="10"
 * />
 * ```
 *
 * @example
 * **Server-side mode** - External API handles pagination/sorting:
 * ```html
 * <adm-data-table
 *   mode="server"
 *   [columns]="columns"
 *   [data]="pageData()"
 *   [totalElements]="totalCount()"
 *   [paginationState]="pagination()"
 *   [sortingState]="sorting()"
 *   (stateChange)="onStateChange($event)"
 * />
 * ```
 *
 * @template T - The type of data rows in the table
 */

export type DataTableStateChangeReason = 'pagination' | 'sorting' | 'filtering';

export interface DataTableStateChangeEvent {
  pagination: PaginationState;
  sorting: SortingState;
  filters: ColumnFiltersState;
  reason: DataTableStateChangeReason;
}
@Component({
  selector: 'adm-data-table',
  imports: [
    HlmTableImports,
    HlmIconImports,
    HlmSpinnerImports,
    HlmButtonImports,
    HlmScrollAreaImports,
    HlmDropdownMenuImports,
    FlexRenderDirective,
    FormsModule,
    TranslocoDirective,
    DataTablePagination,
    TableResizableCell,
    TableResizableHeader,
    NgScrollbarModule,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideSortAsc,
      lucideSortDesc,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * Column definitions for the table.
   * Uses TanStack Table's ColumnDef format.
   *
   * @example
   * ```typescript
   * columns: ColumnDef<User>[] = [
   *   { accessorKey: 'name', header: 'Name' },
   *   { accessorKey: 'email', header: 'Email' },
   * ];
   * ```
   */
  readonly columns = input<ColumnDef<T>[]>([]);

  readonly columnFiltersState = input<ColumnFiltersState>([]);

  /**
   * When true, displays a loading spinner overlay on the table.
   * Useful for indicating server-side data fetching.
   * @default false
   */
  readonly isLoading = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /**
   * The data to display in the table.
   * - In **client mode**: Pass all data; table handles pagination internally.
   * - In **server mode**: Pass only the current page of data.
   */
  readonly data = input<T[]>([]);

  /**
   * Total number of elements across all pages.
   * **Only required in server mode** for proper pagination display.
   * In client mode, this is calculated automatically.
   * @default 0
   */
  readonly totalElements = input<number, NumberInput>(0, { transform: numberAttribute });

  /**
   * Whether to show the pagination controls.
   * @default true
   */
  readonly paginated = input<boolean, BooleanInput>(true, { transform: booleanAttribute });

  /**
   * Enables column resizing via drag handles.
   * @default false
   */
  readonly resizableColumns = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /**
   * Enables checkbox selection for rows.
   * @default false
   */
  readonly enableRowSelection = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  /**
   * External pagination state for server-side mode.
   * Ignored in client mode.
   * @default  pageIndex: 0
   * @default  pageSize: 10
   */
  readonly paginationState = input<PaginationState>({ pageIndex: 0, pageSize: 10 });

  /**
   * External sorting state for server-side mode.
   * Ignored in client mode.
   * @default []
   */
  readonly sortingState = input<SortingState>([]);

  /**
   * The operation mode of the table.
   * - `'client'`: All data is in memory; table handles pagination/sorting/filtering.
   * - `'server'`: External API handles operations; table emits state changes.
   * @default 'client'
   */
  readonly mode = input<'client' | 'server'>('client');

  /**
   * Initial page size for client mode.
   * In server mode, use `paginationState` instead.
   * @default 10
   */
  readonly pageSize = input<number, NumberInput>(10, { transform: numberAttribute });

  /**
   * Available options for the page size dropdown.
   * @default [10, 25, 50, 100]
   */
  readonly pageSizeOptions = input([10, 25, 50, 100]);

  // ==========================================
  // Outputs
  // ==========================================

  /**
   * Emitted when pagination or sorting state changes.
   * **Only used in server mode** to trigger API calls.
   */
  readonly stateChange = output<DataTableStateChangeEvent>();

  // ==========================================
  // State
  // ==========================================

  private readonly columnOrder = signal<string[]>([]);
  private readonly rowSelection = signal<RowSelectionState>({});
  private readonly columnVisibility = signal<VisibilityState>({});

  /** Internal pagination state for client mode. Uses linkedSignal to react to pageSize changes. */
  private readonly internalPagination = linkedSignal<PaginationState>(() => ({
    pageIndex: 0,
    pageSize: this.pageSize(),
  }));

  private readonly internalColumnFilters = signal<ColumnFiltersState>([]);

  /** Internal sorting state for client mode. */
  private readonly internalSorting = signal<SortingState>([]);

  /** Selects the appropriate pagination state based on mode. */
  private readonly activePagination = computed(() =>
    this.isServerMode() ? this.paginationState() : this.internalPagination()
  );

  /** Selects the appropriate sorting state based on mode. */
  private readonly activeSorting = computed(() => (this.isServerMode() ? this.sortingState() : this.internalSorting()));

  /** Column sizing info for resize feature. */
  readonly _columnSizingInfo = computed(() => this.table.getState().columnSizingInfo);

  /** Current column sizes. */
  readonly _columnSizing = computed(() => this.table.getState().columnSizing);

  /** Whether the table is in server mode. */
  private readonly isServerMode = computed(() => this.mode() === 'server');

  /** Number of visible columns, used for colspan in "no data" row. */
  readonly visibleColumnCount = computed(() => Math.max(this.table.getVisibleLeafColumns().length, 1));

  /**
   * Computes CSS variables for column sizes.
   * Optimizes performance by calculating all sizes at once instead of per-cell.
   */
  readonly columnSizeVars = computed(() => {
    void this._columnSizing();
    void this._columnSizingInfo();

    const headers = untracked(() => this.table.getFlatHeaders());
    const colSizes: Record<string, number> = {};
    let i = headers.length;

    while (--i >= 0) {
      const header = headers[i]!;
      colSizes[`--header-${toCssVarToken(header.id)}-size`] = header.getSize();
      colSizes[`--col-${toCssVarToken(header.column.id)}-size`] = header.column.getSize();
    }

    return colSizes;
  });

  // ==========================================
  // Public Methods
  // ==========================================

  /**
   * The TanStack Table instance.
   * Exposes all table methods for advanced use cases.
   */
  readonly table = createAngularTable<T>(() => ({
    data: this.data(),
    columns: this.columns(),
    manualPagination: this.isServerMode(),
    manualSorting: this.isServerMode(),
    manualFiltering: this.isServerMode(),
    rowCount: this.isServerMode() ? this.totalElements() : undefined,
    enableRowSelection: this.enableRowSelection(),
    state: {
      pagination: this.activePagination(),
      sorting: this.activeSorting(),
      columnOrder: this.columnOrder(),
      columnFilters: this.internalColumnFilters(),
      columnVisibility: this.columnVisibility(),
      rowSelection: this.rowSelection(),
    },
    columnResizeMode: 'onChange',
    onSortingChange: (updater) => {
      const current = this.table.getState().sorting;
      const next = typeof updater === 'function' ? updater(current) : updater;

      if (this.isServerMode()) {
        this.emitServerState('sorting', {
          sorting: next,
          pagination: { ...this.table.getState().pagination, pageIndex: 0 },
        });
        return;
      }

      this.internalSorting.set(next);
    },

    onColumnFiltersChange: (updater) => {
      const current = this.table.getState().columnFilters;
      const next = typeof updater === 'function' ? updater(current) : updater;

      if (this.isServerMode()) {
        this.emitServerState('filtering', {
          filters: next,
          pagination: { ...this.table.getState().pagination, pageIndex: 0 },
        });
        return;
      }

      this.internalColumnFilters.set(next);
    },
    onPaginationChange: (updaterOrValue) => {
      const current = this.table.getState().pagination;
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;

      if (this.isServerMode()) {
        this.emitServerState('pagination', { pagination: next });
        return;
      }

      this.internalPagination.set(next);
    },

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: (updater) => {
      updater instanceof Function ? this.columnVisibility.update(updater) : this.columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      updater instanceof Function ? this.rowSelection.update(updater) : this.rowSelection.set(updater);
    },
    onColumnOrderChange: (updater) => {
      updater instanceof Function ? this.columnOrder.update(updater) : this.columnOrder.set(updater);
    },
  }));

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Toggles sorting on a column.
   * Cycles through: none → asc → desc → none
   */
  protected onSort(column: Column<T, unknown>, direction: SortDirection) {
    column.toggleSorting(direction === 'desc', false);
  }

  protected onClearSorting(column: Column<T, unknown>) {
    column.clearSorting();
  }

  private emitServerState(
    reason: DataTableStateChangeReason,
    overrides: Partial<Omit<DataTableStateChangeEvent, 'reason'>> = {}
  ) {
    const state = this.table.getState();

    this.stateChange.emit({
      reason,
      pagination: overrides.pagination ?? state.pagination,
      sorting: overrides.sorting ?? state.sorting,
      filters: overrides.filters ?? state.columnFilters,
    });
  }
}
