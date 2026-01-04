import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { provideTranslocoScope, translateSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideCheck,
  lucideChevronDown,
  lucideCopy,
  lucideMoreHorizontal,
  lucideSearch,
} from '@ng-icons/lucide';
import { DataTableColumnManager } from '@shared/components/columns-manager/data-table-column-manager';
import { DataTable } from '@shared/components/data-table/data-table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { PaymentsActionDropdown } from './action-dropdown';

export interface Payment {
  status: 'success' | 'processing' | 'failed';
  email: string;
  amount: number;
}

@Component({
  selector: 'adm-payments-table',
  imports: [
    HlmTableImports,
    HlmCardImports,
    HlmInputImports,
    HlmInputGroupImports,
    HlmButtonImports,
    HlmIconImports,
    HlmDropdownMenuImports,
    DataTable,
    TranslocoModule,
    DataTableColumnManager,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideCheck,
      lucideCopy,
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideSearch,
    }),
    provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' }),
  ],
  template: `
    <div *transloco="let t; prefix: 'dashboard1.paymentsTable'" hlmCard class="h-full">
      <div hlmCardHeader>
        <h3 hlmCardTitle>{{ t('title') }}</h3>
        <p hlmCardDescription>{{ t('description') }}</p>
      </div>
      <div hlmCardContent class="space-y-4">
        <div class="flex items-center justify-between gap-4">
          <hlm-input-group>
            <input
              *transloco="let t"
              class="h-8 w-full md:w-80"
              hlmInputGroupInput
              [placeholder]="t('common.searchPlaceholder')"
              (input)="_filterChanged($event)"
            />
            <div hlmInputGroupAddon>
              <ng-icon name="lucideSearch" />
            </div>
            <hlm-input-group-addon align="inline-end">
              <!-- @if (this.searchForm.search().value()) {
                <ng-icon class="cursor-pointer" name="lucideX" (click)="searchForm.search().value.set('')" />
              } -->
            </hlm-input-group-addon>
          </hlm-input-group>

          <adm-data-table-column-manager [table]="table()" />
        </div>
        <adm-data-table [columns]="columns" [data]="payments()" [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 50, 100]" />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsTable {
  readonly payments = input<Payment[]>([]);

  readonly dataTable = viewChild.required(DataTable<Payment>);
  protected readonly table = computed(() => this.dataTable().table);

  protected _filterChanged(event: Event) {
    this.table()
      .getColumn('email')
      ?.setFilterValue((event.target as HTMLInputElement).value);
  }

  protected readonly columns: ColumnDef<Payment>[] = [
    {
      accessorKey: 'email',
      id: 'email',
      header: translateSignal('paymentsTable.columns.email'),
      meta: { translationKey: 'dashboard1.paymentsTable.columns.email' },
    },
    {
      accessorKey: 'status',
      id: 'status',
      header: translateSignal('paymentsTable.columns.status'),
      enableSorting: false,
      meta: { translationKey: 'dashboard1.paymentsTable.columns.status' },
    },
    {
      accessorKey: 'amount',
      id: 'amount',
      header: translateSignal('paymentsTable.columns.amount'),
      enableSorting: false,
      meta: { translationKey: 'dashboard1.paymentsTable.columns.amount' },
      cell: (info) => {
        const amount = parseFloat(info.getValue<string>());
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);

        return `<div class="text-start">${formatted}</div>`;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      size: 40,
      cell: () => flexRenderComponent(PaymentsActionDropdown),
    },
  ];
}
