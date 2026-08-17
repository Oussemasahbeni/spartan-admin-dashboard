import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { Row, type RowData, Table } from '@tanstack/angular-table';
import { DataTableFeatures } from './table-features';

@Component({
  imports: [HlmCheckboxImports, TranslocoPipe],
  host: {
    class: 'flex',
  },
  template: `
    <hlm-checkbox
      [aria-label]="'common.selectAll' | transloco"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected() && !table().getIsAllPageRowsSelected()"
      (checkedChange)="table().toggleAllRowsSelected()"
    />
  `,
})
export class TableHeadSelection<T extends RowData> {
  public readonly table = input.required<Table<DataTableFeatures, T>>();
}

@Component({
  imports: [HlmCheckboxImports, TranslocoPipe],
  host: {
    class: 'flex',
  },
  template: `
    <hlm-checkbox
      [aria-label]="'common.selectRow' | transloco"
      [checked]="row().getIsSelected()"
      (checkedChange)="row().toggleSelected($event)"
    />
  `,
})
export class TableRowSelection<T extends RowData> {
  public readonly row = input.required<Row<DataTableFeatures, T>>();
}
