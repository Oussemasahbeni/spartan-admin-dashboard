import { ChangeDetectionStrategy, Component, computed, input, signal, viewChild } from '@angular/core';
import { provideTranslocoScope, translateSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideCheck,
  lucideChevronDown,
  lucideCopy,
  lucideMoreHorizontal,
  lucideSearch,
  lucideX,
} from '@ng-icons/lucide';
import { DataTableColumnManager } from '@shared/components/columns-manager/data-table-column-manager';
import { DataTable } from '@shared/components/data-table/data-table';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { Payment } from '../../model/payment';
import { PaymentStatusUIPipe, providePaymentStatusIcons } from '../../pipes/status-ui.pipe';
import { PaymentsActionDropdown } from './action-dropdown';

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
    HlmBadgeImports,
    DataTable,
    TranslocoModule,
    DataTableColumnManager,
    PaymentStatusUIPipe,
  ],
  providers: [
    provideIcons({
      lucideArrowUpDown,
      lucideCheck,
      lucideCopy,
      lucideChevronDown,
      lucideMoreHorizontal,
      lucideSearch,
      lucideX,
    }),
    providePaymentStatusIcons(),
    provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' }),
  ],
  template: `
    <div *transloco="let t; prefix: 'dashboard1.paymentsTable'" hlmCard class="h-full">
      <div hlmCardHeader>
        <h3 hlmCardTitle class="text-base font-semibold">{{ t('title') }}</h3>
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
              [value]="searchValue()"
              (input)="_filterChanged($event)"
            />
            <div hlmInputGroupAddon>
              <ng-icon name="lucideSearch" />
            </div>
            <hlm-input-group-addon align="inline-end">
              @if (searchValue()) {
                <ng-icon name="lucideX" size="sm" (click)="_clearSearch()" />
              }
            </hlm-input-group-addon>
          </hlm-input-group>

          <adm-data-table-column-manager [table]="table()" />
        </div>
        <adm-data-table [columns]="columns" [data]="payments()" [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 50, 100]">
          <!-- Status Cell -->
          <ng-template #statusCell let-context>
            <span hlmBadge variant="outline" class="text-muted-foreground" [id]="context.row.original.id + '-status'">
              @let status = context.getValue();
              @let ui = status | statusUI;
              <ng-icon size="xs" hlmIcon [class]="ui.class" [name]="ui.icon" />
              <span *transloco="let t; prefix: 'dashboard1.paymentsTable.status'"> {{ t(status) }} </span>
            </span>
          </ng-template>
        </adm-data-table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsTable {
  // ==========================================
  // Inputs
  // ==========================================

  readonly payments = input<Payment[]>([]);

  // ==========================================
  // View Children
  // ==========================================

  readonly statusCell = viewChild.required('statusCell');
  readonly dataTable = viewChild.required(DataTable<Payment>);

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly searchValue = signal('');
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
      cell: () => this.statusCell(),
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

  // ==========================================
  // Public Methods
  // ==========================================

  protected _filterChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.table()
      .getColumn('email')
      ?.setFilterValue((event.target as HTMLInputElement).value);
  }
  protected _clearSearch() {
    this.searchValue.set('');
    this.table().getColumn('email')?.setFilterValue('');
  }
}
