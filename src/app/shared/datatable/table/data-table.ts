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
import { TranslocoDirective } from '@jsverse/transloco';
import { HlmScrollAreaImports } from '@spartan-ng/helm/scroll-area';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';
import { HlmTableImports } from '@spartan-ng/helm/table';
import {
  Column,
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  createAngularTable,
  flexRenderComponent,
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
import { TableResizableCell, TableResizableHeader } from '../directives/resizable-cell';
import { DataTablePagination } from '../pagination/pagination';
import { toCssVarToken } from '../utils/css-var-token';
import { TableHeadSelection, TableRowSelection } from './selection-column';
import { TableSortHeader } from './sort-header';

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

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable<T> {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * Column definitions for the table.
   * Uses TanStack Table's ColumnDef format.
   */
  public readonly columns = input<ColumnDef<T>[]>([]);

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
  public readonly paginated = input(true, { transform: booleanAttribute });

  /**
   * Enables column resizing via drag handles.
   */
  public readonly resizableColumns = input(false, { transform: booleanAttribute });

  /**
   * Enables checkbox selection for rows.
=   */
  public readonly enableRowSelection = input(false, { transform: booleanAttribute });

  /**
   * External pagination state for server-side mode.
   * Ignored in client mode.
   */
  public readonly paginationState = input<PaginationState>({ pageIndex: 0, pageSize: 10 });

  public readonly enableColumnPinning = input(false, { transform: booleanAttribute });

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
  public readonly defaultColumnPinning = input<ColumnPinningState>({});

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
      const selectionColumn: ColumnDef<T> = {
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
  private readonly columnVisibility = signal<VisibilityState>({});

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

  /** Column sizing info for resize feature. */
  protected readonly _columnSizingInfo = computed(() => this.table.getState().columnSizingInfo);

  /** Current column sizes. */
  protected readonly _columnSizing = computed(() => this.table.getState().columnSizing);

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
    this._columnSizingInfo();

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

  protected readonly getCommonPinningStyles = (column: Column<T>) => {
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
   * The TanStack Table instance.
   * Exposes all table methods for advanced use cases.
   */
  public readonly table = createAngularTable<T>(() => ({
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
    ...(this.paginated() ? { getPaginationRowModel: getPaginationRowModel() } : {}),
    ...(this.isServerMode()
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          getSortedRowModel: getSortedRowModel(),
        }),

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
  protected onSort(column: Column<T, unknown>, direction: SortDirection) {
    column.toggleSorting(direction === 'desc', false);
  }

  protected onClearSorting(column: Column<T, unknown>) {
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
    const state = this.table.getState();

    this.stateChange.emit({
      reason,
      pagination: overrides.pagination ?? state.pagination,
      sorting: overrides.sorting ?? state.sorting,
      filters: overrides.filters ?? state.columnFilters,
    });
  }

  private cloneColumnPinningState(state: ColumnPinningState): ColumnPinningState {
    return {
      left: state.left ? [...state.left] : [],
      right: state.right ? [...state.right] : [],
    };
  }
}
