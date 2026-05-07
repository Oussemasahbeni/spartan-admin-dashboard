import { ChangeDetectionStrategy, Component, computed, input, signal, viewChild } from '@angular/core';
import { provideTranslocoScope, translateSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUpDown,
  lucideCheck,
  lucideChevronDown,
  lucideCircleCheck,
  lucideCircleX,
  lucideCopy,
  lucideLoader,
  lucideMoreHorizontal,
  lucideSearch,
  lucideX,
} from '@ng-icons/lucide';
import { DataTableColumnsManager } from '@shared/datatable/columns-manager/columns-manager';
import { DataTable } from '@shared/datatable/table/data-table';
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
    DataTableColumnsManager,
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
      lucideCircleCheck,
      lucideCircleX,
      lucideLoader,
    }),
    provideTranslocoScope({ scope: 'dashboard/dashboard1', alias: 'dashboard1' }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *transloco="let t; prefix: 'dashboard1.paymentsTable'" hlmCard class="h-full">
      <header hlmCardHeader>
        <h1 hlmCardTitle class="text-base font-semibold">{{ t('title') }}</h1>
        <p hlmCardDescription>{{ t('description') }}</p>
      </header>
      <main hlmCardContent class="space-y-4">
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
        <adm-data-table
          [columns]="columns"
          [data]="payments()"
          [paginationState]="{ pageIndex: 0, pageSize: 5 }"
          [pageSizeOptions]="[5, 10, 25, 50, 100]"
        >
          <!-- Status Cell -->
          <ng-template #statusCell let-context>
            <span hlmBadge variant="outline" class="text-muted-foreground" [id]="context.row.original.id + '-status'">
              @let status = context.getValue();
              @switch (status) {
                @case ('success') {
                  <ng-icon hlmIcon size="xs" class="text-green-600" name="lucideCircleCheck" />
                }
                @case ('failed') {
                  <ng-icon hlmIcon size="xs" class="text-destructive" name="lucideCircleX" />
                }
                @case ('processing') {
                  <ng-icon hlmIcon size="xs" class="animate-spin text-yellow-600" name="lucideLoader" />
                }
              }
              <span *transloco="let t; prefix: 'dashboard1.paymentsTable.status'"> {{ t(status) }} </span>
            </span>
          </ng-template>
        </adm-data-table>
      </main>
    </div>
  `,
})
export class PaymentsTable {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly payments = input<Payment[]>([]);

  // ==========================================
  // View Children
  // ==========================================

  protected readonly statusCell = viewChild.required('statusCell');
  protected readonly dataTable = viewChild.required(DataTable<Payment>);

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly searchValue = signal('');

  private readonly usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

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
        const amount = Number(info.getValue<string>());
        return Number.isFinite(amount) ? this.usdFormatter.format(amount) : '-';
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
