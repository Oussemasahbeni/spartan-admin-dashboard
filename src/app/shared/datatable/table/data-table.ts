import {
  booleanAttribute,
  Component,
  computed,
  input,
  isDevMode,
  linkedSignal,
  model,
  numberAttribute,
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
  FlexRenderDirective,
  injectTable,
  isFunction,
  PaginationState,
  RowData,
  RowSelectionState,
  SortDirection,
  SortingState,
  TanStackTable,
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
 *   [(pagination)]="pagination()"
 *   [(sorting)]="sorting()"
 * />
 * ```
 *
 * @template T - The type of data rows in the table
 */

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
    TanStackTable,
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.css',
})
export class DataTable<T extends RowData> {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * The operation mode of the table.
   * - client: All data is in memory; table handles pagination/sorting/filtering.
   * - server: External API handles operations; table emits state changes.
   * @default 'client'
   */
  public readonly mode = input<'client' | 'server'>('client');

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
   * Only required in server mode for proper pagination display.
   * In client mode, this is calculated automatically.
   */
  public readonly totalElements = input(0, { transform: numberAttribute });

  /**
   * Returns a stable, backend-provided id for a row (e.g. `user => user.id`).
   * Required for row selection to survive page changes in server mode —
   * without it, rows are identified by page-relative index.
   */
  public readonly getRowId = input<(row: T, index: number) => string>();

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
   */
  public readonly enableRowSelection = input(false, { transform: booleanAttribute });

  /**
   * Enables column pinning (sticky columns) for start/end positions.
   */
  public readonly enableColumnPinning = input(false, { transform: booleanAttribute });

  /**
   * External column pinning state for server-side mode.
   */
  public readonly defaultColumnPinning = input<ColumnPinningState>({ start: [], end: [] });

  /**
   * Available options for the page size dropdown.
   */
  public readonly pageSizeOptions = input([10, 25, 50, 100]);

  // ==========================================
  // Two-way bound state
  // ==========================================

  public readonly pagination = model<PaginationState>({ pageIndex: 0, pageSize: 10 });
  public readonly sorting = model<SortingState>([]);
  public readonly columnFilters = model<ColumnFiltersState>([]);
  public readonly rowSelection = model<RowSelectionState>({});

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
        header: () => TableHeadSelection,
        cell: () => TableRowSelection,
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
  private readonly columnVisibility = signal<ColumnVisibilityState>({});

  private readonly columnPinning = linkedSignal<ColumnPinningState>(() =>
    this.cloneColumnPinningState(this.defaultColumnPinning())
  );

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
    const isPinnedStart = isPinned === 'start';
    const isPinnedEnd = isPinned === 'end';

    return {
      insetInlineStart: isPinnedStart ? `${column.getStart('start')}px` : undefined,
      insetInlineEnd: isPinnedEnd ? `${column.getAfter('end')}px` : undefined,
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
  public readonly table = injectTable(() => ({
    features: dataTableFeatures,
    debugTable: isDevMode(),
    data: this.data(),
    columns: this._columns(),
    manualPagination: this.isServerMode(),
    manualSorting: this.isServerMode(),
    manualFiltering: this.isServerMode(),
    rowCount: this.isServerMode() ? this.totalElements() : undefined,
    getRowId: this.getRowId(),
    enableRowSelection: this.enableRowSelection(),
    enableColumnPinning: this.enableColumnPinning(),
    state: {
      pagination: this.pagination(),
      sorting: this.sorting(),
      columnOrder: this.columnOrder(),
      columnFilters: this.columnFilters(),
      columnVisibility: this.columnVisibility(),
      columnPinning: this.columnPinning(),
      rowSelection: this.rowSelection(),
    },
    columnResizeMode: 'onChange',
    onSortingChange: (updater) => {
      isFunction(updater) ? this.sorting.update(updater) : this.sorting.set(updater);
      this.pagination.update((p) => ({ ...p, pageIndex: 0 }));
    },

    onColumnFiltersChange: (updater) => {
      isFunction(updater) ? this.columnFilters.update(updater) : this.columnFilters.set(updater);
      this.pagination.update((p) => ({ ...p, pageIndex: 0 }));
    },
    onPaginationChange: (updater) => {
      isFunction(updater) ? this.pagination.update(updater) : this.pagination.set(updater);
    },
    onColumnVisibilityChange: (updater) => {
      isFunction(updater) ? this.columnVisibility.update(updater) : this.columnVisibility.set(updater);
    },
    onRowSelectionChange: (updater) => {
      isFunction(updater) ? this.rowSelection.update(updater) : this.rowSelection.set(updater);
    },
    onColumnOrderChange: (updater) => {
      isFunction(updater) ? this.columnOrder.update(updater) : this.columnOrder.set(updater);
    },
    onColumnPinningChange: (updater) => {
      isFunction(updater) ? this.columnPinning.update(updater) : this.columnPinning.set(updater);
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

  private cloneColumnPinningState(state: ColumnPinningState): ColumnPinningState {
    return {
      start: state.start ? [...state.start] : [],
      end: state.end ? [...state.end] : [],
    };
  }
}
