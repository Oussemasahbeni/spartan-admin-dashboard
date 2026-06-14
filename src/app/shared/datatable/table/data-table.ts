import {
  booleanAttribute,
  Component,
  computed,
  input,
  isDevMode,
  linkedSignal,
  numberAttribute,
  output,
  signal,
  untracked,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  ColumnVisibilityState,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  flexRenderComponent,
  FlexRenderDirective,
  injectTable,
  PaginationState,
  RowData,
  RowSelectionState,
  SortDirection,
  sortFns,
  SortingState,
} from '@tanstack/angular-table';
import { TableResizableCell, TableResizableHeader } from '../directives/resizable-cell';
import { DataTablePagination } from '../pagination/pagination';
import { toCssVarToken } from '../utils/css-var-token';
import { TableHeadSelection, TableRowSelection } from './selection-column';
import { TableSortHeader } from './sort-header';
import { dataTableFeatures, DataTableFeatures } from './table-features';

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

export interface DataTableRowSelectionChangeEvent<T> {
  rowSelection: RowSelectionState;
  selectedRows: T[];
}
@Component({
  selector: 'adm-data-table',
  imports: [
    HlmTableImports,
    HlmSpinnerImports,
    HlmScrollAreaImports,
    FlexRenderDirective,
    TranslocoDirective,
    DataTablePagination,
    TableResizableCell,
    TableResizableHeader,
    TableSortHeader,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T extends RowData> {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * Column definitions for the table.
   * Uses TanStack Table's ColumnDef format.
   */
  public readonly columns = input<ColumnDef<DataTableFeatures, T>[]>([]);

  /**
   * When true, displays a loading spinner overlay on the table.
   * Useful for indicating server-side data fetching.
   */
  public readonly isLoading = input(false, { transform: booleanAttribute });

  /**
   * The data to display in the table.
   * - In **client mode**: Pass all data; table handles pagination internally.
   * - In **server mode**: Pass only the current page of data.
   */
  public readonly data = input<T[]>([]);

  /**
   * Total number of elements across all pages.
   * **Only required in server mode** for proper pagination display.
   * In client mode, this is calculated automatically.
   */
  public readonly totalElements = input(0, { transform: numberAttribute });

  /**
   * Whether to show the pagination controls.
   */
  public readonly enablePagination = input(true, { transform: booleanAttribute });

  /**
   * Enables column resizing via drag handles.
   */
  public readonly enableColumnResizing = input(false, { transform: booleanAttribute });

  /**
   * Enables checkbox selection for rows.
=   */
  public readonly enableRowSelection = input(false, { transform: booleanAttribute });
  public readonly enableColumnPinning = input(false, { transform: booleanAttribute });

  /**
   * External pagination state for server-side mode.
   * Ignored in client mode.
   */
  public readonly paginationState = input<PaginationState>({ pageIndex: 0, pageSize: 10 });

  /**
   * External sorting state for server-side mode.
   * Ignored in client mode.
   */
  public readonly sortingState = input<SortingState>([]);

  /**
   * External column filters state for server-side mode.
   * Ignored in client mode.
   */
  public readonly columnFiltersState = input<ColumnFiltersState>([]);

  /**
   * External column pinning state for server-side mode.
   */
  public readonly defaultColumnPinning = input<ColumnPinningState>({ left: [], right: [] });

  /**
   * The operation mode of the table.
   * - `'client'`: All data is in memory; table handles pagination/sorting/filtering.
   * - `'server'`: External API handles operations; table emits state changes.
   * @default 'client'
   */
  public readonly mode = input<'client' | 'server'>('client');

  /**
   * Available options for the page size dropdown.
   */
  public readonly pageSizeOptions = input([10, 25, 50, 100]);

  // ==========================================
  // Outputs
  // ==========================================

  /**
   * Emitted when pagination or sorting state changes.
   * **Only used in server mode** to trigger API calls.
   */
  public readonly stateChange = output<DataTableStateChangeEvent>();

  /**
   * Emitted when row selection changes.
   * Contains both the TanStack selection state and resolved selected row items.
   */
  public readonly rowSelectionChange = output<DataTableRowSelectionChangeEvent<T>>();

  // ==========================================
  // State
  // ==========================================

  /**
   * Internal column definitions, augmented with selection column if row selection is enabled.
   * This allows us to keep the original columns input clean and add the selection column dynamically.
   * The selection column is added as the first column when enableRowSelection is true.
   * It includes a header checkbox for "select all" and row checkboxes for individual selection.
   */
  protected readonly _columns = computed(() => {
    const baseColumns = this.columns();

    if (this.enableRowSelection() && !baseColumns.some((column) => column.id === 'select')) {
      const selectionColumn: ColumnDef<DataTableFeatures, T> = {
        id: 'select',
        header: () => flexRenderComponent(TableHeadSelection),
        cell: () => flexRenderComponent(TableRowSelection),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 30,
      };

      return [selectionColumn, ...baseColumns];
    }
    return baseColumns;
  });

  private readonly columnOrder = signal<string[]>([]);
  private readonly rowSelection = signal<RowSelectionState>({});
  private readonly columnVisibility = signal<ColumnVisibilityState>({});

  private readonly columnPinning = linkedSignal<ColumnPinningState>(() =>
    this.cloneColumnPinningState(this.defaultColumnPinning())
  );

  private readonly internalColumnFilters = signal<ColumnFiltersState>([]);

  private readonly internalPagination = linkedSignal<PaginationState>(() => this.paginationState());

  private readonly activePagination = computed(() =>
    this.isServerMode() ? this.paginationState() : this.internalPagination()
  );

  private readonly activeColumnFilters = computed(() =>
    this.isServerMode() ? this.columnFiltersState() : this.internalColumnFilters()
  );

  /** Internal sorting state for client mode. */
  private readonly internalSorting = signal<SortingState>([]);

  /** Selects the appropriate sorting state based on mode. */
  private readonly activeSorting = computed(() => (this.isServerMode() ? this.sortingState() : this.internalSorting()));

  /** Column resizing interaction state (v8's `columnSizingInfo`). */
  protected readonly _columnResizing = computed(() => this.table.atoms.columnResizing.get());

  /** Current column sizes (widths). */
  protected readonly _columnSizing = computed(() => this.table.atoms.columnSizing.get());

  /** Whether the table is in server mode. */
  private readonly isServerMode = computed(() => this.mode() === 'server');

  /** Number of visible columns, used for colspan in "no data" row. */
  protected readonly visibleColumnCount = computed(() => Math.max(this.table.getVisibleLeafColumns().length, 1));

  /**
   * Computes CSS variables for column sizes.
   * Optimizes performance by calculating all sizes at once instead of per-cell.
   */
  protected readonly columnSizeVars = computed(() => {
    this._columnSizing();
    this._columnResizing();

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

  protected readonly getCommonPinningStyles = (column: Column<DataTableFeatures, T>) => {
    if (!this.enableColumnPinning()) {
      return {};
    }
    const isPinned = column.getIsPinned();
    const isPinnedLeft = isPinned === 'left';
    const isPinnedRight = isPinned === 'right';

    return {
      insetInlineStart: isPinnedLeft ? `${column.getStart('left')}px` : undefined,
      insetInlineEnd: isPinnedRight ? `${column.getAfter('right')}px` : undefined,
      position: isPinned ? 'sticky' : 'relative',
      width: `${column.getSize()}px`,
    };
  };

  // ==========================================
  // Public Methods
  // ==========================================

  /**
   * Stable row-model factory instances.
   * Created once (not inside the `injectTable` initializer) so the table's
   * memoization survives initializer re-evaluation on every data change.
   */
  private readonly _paginatedRowModel = createPaginatedRowModel<DataTableFeatures, T>();
  private readonly _filteredRowModel = createFilteredRowModel<DataTableFeatures, T>(filterFns);
  private readonly _sortedRowModel = createSortedRowModel<DataTableFeatures, T>(sortFns);

  /**
   * The TanStack Table instance.
   * Exposes all table methods for advanced use cases.
   */
  public readonly table = injectTable(() => ({
    features: dataTableFeatures,
    debugTable: isDevMode(),
    rowModels: {
      ...(this.enablePagination() ? { paginatedRowModel: this._paginatedRowModel } : {}),
      ...(this.isServerMode()
        ? {}
        : {
            filteredRowModel: this._filteredRowModel,
            sortedRowModel: this._sortedRowModel,
          }),
    },
    data: this.data(),
    columns: this._columns(),
    manualPagination: this.isServerMode(),
    manualSorting: this.isServerMode(),
    manualFiltering: this.isServerMode(),
    rowCount: this.isServerMode() ? this.totalElements() : undefined,
    enableRowSelection: this.enableRowSelection(),
    enableColumnPinning: this.enableColumnPinning(),
    state: {
      pagination: this.activePagination(),
      sorting: this.activeSorting(),
      columnOrder: this.columnOrder(),
      columnFilters: this.activeColumnFilters(),
      columnVisibility: this.columnVisibility(),
      columnPinning: this.columnPinning(),
      rowSelection: this.rowSelection(),
    },

    columnResizeMode: 'onChange',
    onSortingChange: (updater) => {
      const current = this.table.atoms.sorting.get();
      const next = typeof updater === 'function' ? updater(current) : updater;

      if (this.isServerMode()) {
        this.emitServerState('sorting', {
          sorting: next,
          pagination: { ...this.table.atoms.pagination.get(), pageIndex: 0 },
        });
        return;
      }

      this.internalSorting.set(next);
    },

    onColumnFiltersChange: (updater) => {
      const current = this.table.atoms.columnFilters.get();
      const next = typeof updater === 'function' ? updater(current) : updater;

      if (this.isServerMode()) {
        this.emitServerState('filtering', {
          filters: next,
          pagination: { ...this.table.atoms.pagination.get(), pageIndex: 0 },
        });
        return;
      }

      this.internalColumnFilters.set(next);
    },
    onPaginationChange: (updaterOrValue) => {
      const current = this.table.atoms.pagination.get();
      const next = typeof updaterOrValue === 'function' ? updaterOrValue(current) : updaterOrValue;

      if (this.isServerMode()) {
        this.emitServerState('pagination', { pagination: next });
        return;
      }

      this.internalPagination.set(next);
    },

    onColumnVisibilityChange: (updater) => {
      updater instanceof Function ? this.columnVisibility.update(updater) : this.columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      const current = this.rowSelection();
      const next = typeof updater === 'function' ? updater(current) : updater;

      this.rowSelection.set(next);
      this.emitRowSelectionChange(next);
    },
    onColumnOrderChange: (updater) => {
      updater instanceof Function ? this.columnOrder.update(updater) : this.columnOrder.set(updater);
    },
    onColumnPinningChange: (updater) => {
      updater instanceof Function ? this.columnPinning.update(updater) : this.columnPinning.set(updater);
    },
  }));

  // ═══════════════════════════════════════════════════════════════════════════
  // METHODS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Toggles sorting on a column.
   * Cycles through: none → asc → desc → none
   */
  protected onSort(column: Column<DataTableFeatures, T>, direction: SortDirection) {
    column.toggleSorting(direction === 'desc', false);
  }

  protected onClearSorting(column: Column<DataTableFeatures, T>) {
    column.clearSorting();
  }

  private emitRowSelectionChange(rowSelection: RowSelectionState) {
    this.rowSelectionChange.emit({
      rowSelection,
      selectedRows: this.table.getSelectedRowModel().rows.map((row) => row.original),
    });
  }

  private emitServerState(
    reason: DataTableStateChangeReason,
    overrides: Partial<Omit<DataTableStateChangeEvent, 'reason'>> = {}
  ) {
    this.stateChange.emit({
      reason,
      pagination: overrides.pagination ?? this.table.atoms.pagination.get(),
      sorting: overrides.sorting ?? this.table.atoms.sorting.get(),
      filters: overrides.filters ?? this.table.atoms.columnFilters.get(),
    });
  }

  private cloneColumnPinningState(state: ColumnPinningState): ColumnPinningState {
    return {
      left: state.left ? [...state.left] : [],
      right: state.right ? [...state.right] : [],
    };
  }
}
