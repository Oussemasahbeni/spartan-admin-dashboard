import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { type CellContext, type HeaderContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-checkbox
      [checked]="_context.table.getIsAllRowsSelected()"
      [indeterminate]="_context.table.getIsSomeRowsSelected()"
      (checkedChange)="_context.table.toggleAllRowsSelected()"
    />
  `,
})
export class TableHeadSelection<T> {
  // ==========================================
  // State
  // ==========================================

  protected readonly _context = injectFlexRenderContext<HeaderContext<T, unknown>>();
}

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-checkbox
      [checked]="_context.row.getIsSelected()"
      (checkedChange)="_context.row.getToggleSelectedHandler()($event)"
    />
  `,
})
export class TableRowSelection<T> {
  // ==========================================
  // State
  // ==========================================

  protected readonly _context = injectFlexRenderContext<CellContext<T, unknown>>();
}
