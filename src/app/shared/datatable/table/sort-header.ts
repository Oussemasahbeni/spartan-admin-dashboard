import { Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowDown, lucideArrowUp, lucideArrowUpDown, lucideEyeOff, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { Column, RowData } from '@tanstack/angular-table';
import { DataTableFeatures } from './table-features';

@Component({
  selector: 'adm-table-sort-header',
  imports: [HlmDropdownMenuImports, NgIcon, HlmButtonImports, TranslocoDirective],
  host: {
    class: 'flex',
  },
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideArrowUp,
      lucideArrowDown,
      lucideX,
      lucideEyeOff,
    }),
  ],
  template: `
    <button type="button" hlmBtn variant="ghost" class="-m-2.5" [hlmDropdownMenuTrigger]="menu">
      {{ headerCell() }}
      @switch (column().getIsSorted()) {
        @case ('desc') {
          <ng-icon name="lucideArrowDown" />
        }
        @case ('asc') {
          <ng-icon name="lucideArrowUp" />
        }
        @default {
          <ng-icon name="lucideArrowUpDown" />
        }
      }
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-group *transloco="let t">
          <button type="button" hlmDropdownMenuItem (click)="column().toggleSorting(false)">
            <div class="flex items-center gap-2">
              <ng-icon name="lucideArrowUp" />
              {{ t('sort.asc') }}
            </div>

            <hlm-dropdown-menu-checkbox-indicator />
          </button>

          <button type="button" hlmDropdownMenuItem (click)="column().toggleSorting(true)">
            <div class="flex items-center gap-2">
              <ng-icon name="lucideArrowDown" />
              {{ t('sort.desc') }}
            </div>
            <hlm-dropdown-menu-checkbox-indicator />
          </button>

          <hlm-dropdown-menu-separator />
          <button type="button" hlmDropdownMenuItem (click)="column().toggleVisibility(false)">
            <ng-icon name="lucideEyeOff" />
            {{ t('buttons.hide') }}
          </button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class TableSortHeader<T extends RowData> {
  public readonly column = input.required<Column<DataTableFeatures, T>>();
  public readonly headerCell = input.required<string>();
}
