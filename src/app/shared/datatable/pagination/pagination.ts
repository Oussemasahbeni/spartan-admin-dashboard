import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideChevronFirst,
  lucideChevronLast,
  lucideChevronLeft,
  lucideChevronRight,
} from '@ng-icons/lucide';

import { HlmButtonImports } from '@spartan-ng/helm/button';

import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTooltipImports } from '@spartan-ng/helm/tooltip';

import { injectTableContext } from '@tanstack/angular-table';

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
  imports: [HlmSelectImports, HlmLabelImports, HlmButtonImports, NgIcon, HlmTooltipImports, FormsModule, TranslocoModule],
  providers: [
    provideIcons({
      lucideChevronDown,
      lucideChevronFirst,
      lucideChevronLast,
      lucideChevronRight,
      lucideChevronLeft,
    }),
  ],
  template: `
    <div *transloco="let t; prefix: 'pagination'" class="mt-2 flex justify-end gap-2 sm:mt-0 sm:gap-5">
      <div class="flex gap-2">
        <span class="hidden sm:flex" hlmLabel>{{ t('itemsPerPage') }}</span>
        <hlm-select
          class="inline-block"
          [ngModel]="table().atoms.pagination.get().pageSize"
          (ngModelChange)="handlePageSizeChange($event)"
        >
          <hlm-select-trigger size="sm" class="mr-1 inline-flex h-8 w-fit">
            <hlm-select-value />
          </hlm-select-trigger>
          <hlm-select-content *hlmSelectPortal>
            @for (size of pageSizeOptions(); track size) {
              <hlm-select-item [value]="size"> {{ size }} </hlm-select-item>
            }
          </hlm-select-content>
        </hlm-select>
      </div>

      <span hlmLabel>
        {{ t('page', { page: table().atoms.pagination.get().pageIndex + 1, totalPages: table().getPageCount() }) }}
      </span>

      <div class="flex gap-1">
        <button
          type="button"
          size="icon-sm"
          variant="outline"
          hlmBtn
          [disabled]="!table().getCanPreviousPage()"
          [hlmTooltip]="t('firstPage')"
          [aria-label]="t('firstPage')"
          (click)="table().firstPage()"
        >
          <ng-icon class="rtl:rotate-180" name="lucideChevronFirst" />
        </button>
        <button
          type="button"
          size="icon-sm"
          variant="outline"
          hlmBtn
          [disabled]="!table().getCanPreviousPage()"
          [hlmTooltip]="t('previousPage')"
          [aria-label]="t('previousPage')"
          (click)="table().previousPage()"
        >
          <ng-icon class="rtl:rotate-180" name="lucideChevronLeft" />
        </button>
        <button
          type="button"
          size="icon-sm"
          variant="outline"
          hlmBtn
          [disabled]="!table().getCanNextPage()"
          [hlmTooltip]="t('nextPage')"
          [aria-label]="t('nextPage')"
          (click)="table().nextPage()"
        >
          <ng-icon class="rtl:rotate-180" name="lucideChevronRight" />
        </button>
        <button
          type="button"
          size="icon-sm"
          variant="outline"
          hlmBtn
          [disabled]="!table().getCanNextPage()"
          [hlmTooltip]="t('lastPage')"
          [aria-label]="t('lastPage')"
          (click)="table().lastPage()"
        >
          <ng-icon class="rtl:rotate-180" name="lucideChevronLast" />
        </button>
      </div>
    </div>
  `,
})
export class DataTablePagination {
  // ==========================================
  // Inputs
  // ==========================================

  /**
   * Available options for the page size dropdown.
   */
  public readonly pageSizeOptions = input([10, 25, 50, 100]);

  /**
   * The TanStack Table instance to control.
   * Required for accessing pagination state and methods.
   */
  protected readonly table = injectTableContext();

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
