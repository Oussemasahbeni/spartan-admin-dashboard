import type { RowData } from '@tanstack/angular-table';

declare module '@tanstack/angular-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Translation key for the column header (used in column manager) */
    translationKey?: string;
  }
}
