import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronFirst,
  lucideChevronLast,
  lucideChevronLeft,
  lucideChevronRight,
} from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

import { Table } from '@tanstack/angular-table';

/**
 * Pagination controls for the DataTable component.
 * Provides navigation buttons and page size selection.
 *
 * @example
 * ```html
 * <adm-pagination
 *   [table]="table"
 *   [pageSizeOptions]="[5, 10, 25, 50]"
 * />
 * ```
 *
 * @template T - The type of data rows in the table
 */
@Component({
  selector: 'adm-pagination',
  imports: [
    HlmSelectImports,
    HlmLabelImports,
    HlmButtonImports,
    HlmIconImports,
    HlmTooltipImports,
    FormsModule,
    TranslocoModule,
  ],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideChevronFirst,
      lucideChevronLast,
      lucideChevronRight,
      lucideChevronLeft,
    }),
  ],
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTablePagination<T> {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * Available options for the page size dropdown.
   * @default [10, 25, 50, 100]
   *
   * @example
   * ```html
   * <adm-pagination [pageSizeOptions]="[5, 10, 20]" />
   * ```
   */
  readonly pageSizeOptions = input([10, 25, 50, 100]);

  /**
   * The TanStack Table instance to control.
   * Required for accessing pagination state and methods.
   */
  readonly table = input.required<Table<T>>();

  // ==========================================
  // Public Methods
  // ==========================================

  /**
   * Handles page size selection changes.
   * Resets to the first page when page size changes.
   *
   * @param value - The new page size (from select dropdown)
   */
  handlePageSizeChange(value: string | number) {
    const size = Number(value);
    if (!Number.isFinite(size) || size <= 0) return;
    this.table().setPagination({ pageIndex: 0, pageSize: size });
  }
}
