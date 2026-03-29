import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideSortAsc, lucideSortDesc, lucideX } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Column, Header, SortDirection } from '@tanstack/angular-table';

@Component({
  selector: 'adm-table-sort-header',
  imports: [HlmDropdownMenuImports, HlmIconImports, HlmButtonImports, TranslocoDirective],
  host: {
    class: 'flex',
  },
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideSortAsc,
      lucideSortDesc,
      lucideX,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="flex items-center gap-2 capitalize" [hlmDropdownMenuTrigger]="menu">
      {{ headerCell() }}
      @if (header().column.getIsSorted() === 'asc') {
        <ng-icon hlm size="sm" name="lucideSortAsc" />
      } @else if (header().column.getIsSorted() === 'desc') {
        <ng-icon hlm size="sm" name="lucideSortDesc" />
      } @else {
        <ng-icon hlm size="sm" name="lucideArrowUpDown" />
      }
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-group *transloco="let t">
          <button
            type="button"
            hlmDropdownMenuCheckbox
            [checked]="header().column.getIsSorted() === 'asc'"
            (click)="onSort(header().column, 'asc')"
          >
            <div class="flex items-center gap-2">
              <ng-icon hlm size="sm" name="lucideSortAsc" />
              <span>{{ t('sort.asc') }}</span>
            </div>

            <hlm-dropdown-menu-checkbox-indicator />
          </button>

          <button
            type="button"
            hlmDropdownMenuCheckbox
            [checked]="header().column.getIsSorted() === 'desc'"
            (click)="onSort(header().column, 'desc')"
          >
            <div class="flex items-center gap-2">
              <ng-icon hlm size="sm" name="lucideSortDesc" />
              <span>{{ t('sort.desc') }}</span>
            </div>
            <hlm-dropdown-menu-checkbox-indicator />
          </button>
          @if (header().column.getIsSorted()) {
            <button type="button" hlmDropdownMenuItem (click)="onClearSorting(header().column)">
              <ng-icon hlm size="sm" name="lucideX" />
              {{ t('buttons.clear') }}
            </button>
          }
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class TableSortHeader<T> {
  public readonly header = input.required<Header<T, unknown>>();

  public readonly headerCell = input.required<string>();

  /**
   * Toggles sorting on a column.
   * Cycles through: none → asc → desc → none
   */
  protected onSort(column: Column<T>, direction: SortDirection) {
    column.toggleSorting(direction === 'desc', false);
  }

  protected onClearSorting(column: Column<T>) {
    column.clearSorting();
  }
}
