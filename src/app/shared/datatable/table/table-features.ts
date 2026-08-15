import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludes,
  filterFn_equals,
  filterFn_includesString,
  filterFn_inDateRange,
  filterFn_inNumberRange,
  filterFn_weakEquals,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';

export interface ColumnMeta {
  translationKey?: string;
}

/**
 * The curated set of TanStack Table v9 features used across the shared DataTable.
 *
 * Declared once as a stable module-scope reference so it can be passed to
 * `injectTable(...)` without being recreated on every initializer evaluation,
 * and so consumers can derive {@link DataTableFeatures} for their column defs.
 *
 * Note: v8's combined column sizing feature is split in v9 — interactive
 * drag-to-resize requires BOTH `columnSizingFeature` and `columnResizingFeature`.
 */
export const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  columnPinningFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnResizingFeature,
  columnMeta: metaHelper<ColumnMeta>,
  filterFns: {
    arrIncludes: filterFn_arrIncludes,
    equals: filterFn_equals,
    inDateRange: filterFn_inDateRange,
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
    weakEquals: filterFn_weakEquals,
  },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

export type DataTableFeatures = typeof dataTableFeatures;
