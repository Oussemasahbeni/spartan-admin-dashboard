import { Component, input } from '@angular/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { Row, type RowData, Table } from '@tanstack/angular-table';
import { DataTableFeatures } from './table-features';

@Component({
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },
  template: `
    <hlm-checkbox
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
  imports: [HlmCheckboxImports],
  host: {
    class: 'flex',
  },

  template: `
    <hlm-checkbox [checked]="row().getIsSelected()" (checkedChange)="row().toggleSelected($event)" />
  `,
})
export class TableRowSelection<T extends RowData> {
  public readonly row = input.required<Row<DataTableFeatures, T>>();
}
