import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/angular-table';

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
  columnPinningFeature,
  columnOrderingFeature,
  columnSizingFeature,
  columnResizingFeature,
});

/** The `TFeatures` type argument for all DataTable column/table type annotations. */
export type DataTableFeatures = typeof dataTableFeatures;
