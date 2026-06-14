import type { CellData, RowData, TableFeatures } from '@tanstack/angular-table';

declare module '@tanstack/angular-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TFeatures extends TableFeatures, TData extends RowData, TValue extends CellData = CellData> {
    /** Translation key for the column header (used in column manager) */
    translationKey?: string;
  }
}
