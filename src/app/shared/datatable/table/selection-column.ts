import { Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { type CellContext, type HeaderContext, injectFlexRenderContext, type RowData } from '@tanstack/angular-table';
import { DataTableFeatures } from './table-features';

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },
  template: `
    <hlm-checkbox
      [checked]="_context.table.getIsAllRowsSelected()"
      [indeterminate]="_context.table.getIsSomeRowsSelected()"
      (checkedChange)="_context.table.toggleAllRowsSelected()"
    />
  `,
})
export class TableHeadSelection<T extends RowData> {
  // ==========================================
  // State
  // ==========================================

  protected readonly _context = injectFlexRenderContext<HeaderContext<DataTableFeatures, T, unknown>>();
}

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },

  template: `
    <hlm-checkbox
      [checked]="_context.row.getIsSelected()"
      (checkedChange)="_context.row.getToggleSelectedHandler()($event)"
    />
  `,
})
export class TableRowSelection<T extends RowData> {
  // ==========================================
  // State
  // ==========================================

  protected readonly _context = injectFlexRenderContext<CellContext<DataTableFeatures, T, unknown>>();
}
