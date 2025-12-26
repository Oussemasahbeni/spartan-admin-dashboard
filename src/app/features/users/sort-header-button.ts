import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import {
  type HeaderContext,
  injectFlexRenderContext,
} from '@tanstack/angular-table';

@Component({
  imports: [HlmButtonImports, HlmIconImports],
  providers: [provideIcons({ lucideArrowUpDown })],
  template: `
    <button
      type="button"
      class="flex items-center gap-2 cursor-pointer"
      [class.capitalize]="header() === ''"
      (click)="filterClick()"
    >
      {{ _header() }}
      <ng-icon hlm size="sm" name="lucideArrowUpDown" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeadSortButton<T> {
  protected readonly _context =
    injectFlexRenderContext<HeaderContext<T, unknown>>();
  protected filterClick() {
    this._context.column.toggleSorting(
      this._context.column.getIsSorted() === 'asc'
    );
  }
  public readonly header = input('');
  protected readonly _header = computed(() => {
    return this.header() === '' ? this._context.column.id : this.header();
  });
}
