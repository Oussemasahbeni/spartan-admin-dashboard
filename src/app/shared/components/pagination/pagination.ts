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
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { Table } from '@tanstack/angular-table';

@Component({
  selector: 'adm-pagination',
  imports: [
    BrnSelectImports,
    HlmSelectImports,
    HlmLabelImports,
    HlmButtonImports,
    HlmIconImports,
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
  readonly pageSizeOptions = input([10, 25, 50, 100]);
  readonly table = input.required<Table<T>>();

  handlePageSizeChange(value: string | number) {
    const size = Number(value);
    this.table().setPageSize(size);
    this.table().resetPageIndex();
  }
}
