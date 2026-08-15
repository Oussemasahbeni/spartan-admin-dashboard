import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { Row, type RowData, Table } from '@tanstack/angular-table';
import { DataTableFeatures } from './table-features';

@Component({
  imports: [HlmCheckboxImports, TranslocoDirective],
  host: {
    class: 'flex',
  },
  template: `
    <hlm-checkbox
      *transloco="let t"
      [aria-label]="t('common.selectAll')"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected()"
      (checkedChange)="table().toggleAllRowsSelected()"
    />
  `,
})
export class TableHeadSelection<T extends RowData> {
  public readonly table = input.required<Table<DataTableFeatures, T>>();
}

@Component({
  imports: [HlmCheckboxImports, TranslocoDirective],
  host: {
    class: 'flex',
  },

  template: `
    <hlm-checkbox
      *transloco="let t"
      [aria-label]="t('common.selectRow')"
      [checked]="row().getIsSelected()"
      (checkedChange)="row().toggleSelected($event)"
    />
  `,
})
export class TableRowSelection<T extends RowData> {
  public readonly row = input.required<Row<DataTableFeatures, T>>();
}
