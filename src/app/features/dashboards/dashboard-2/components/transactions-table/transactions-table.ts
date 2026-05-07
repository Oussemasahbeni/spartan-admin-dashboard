import { ChangeDetectionStrategy, Component, computed, input, signal, TemplateRef, viewChild } from '@angular/core';
import { debounce, form, FormField } from '@angular/forms/signals';
import { translateSignal, TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideSearch, lucideX } from '@ng-icons/lucide';
import { DataTableColumnsManager } from '@shared/datatable/columns-manager/columns-manager';
import { DataTable } from '@shared/datatable/table/data-table';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { CellContext, ColumnDef } from '@tanstack/angular-table';
import { Transaction } from '../../model/dashboard-2';
import { provideTransactionStatusIcons, TransactionStatusUIPipe } from '../../pipes/status-ui.pipe';

@Component({
  selector: 'adm-transactions-table',
  imports: [
    HlmAvatarImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmIconImports,
    HlmInputImports,
    HlmInputGroupImports,
    TransactionStatusUIPipe,
    TranslocoModule,
    DataTable,
    DataTableColumnsManager,
    FormField,
  ],
  providers: [
    provideTransactionStatusIcons(),
    provideIcons({
      lucideSearch,
      lucideX,
    }),
  ],
  templateUrl: './transactions-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly transactions = input.required<Transaction[]>();

  // ==========================================
  // View Children
  // ==========================================

  /**
   * Template references for custom cell rendering.
   */
  protected readonly dataTable = viewChild.required(DataTable<Transaction>);
  protected readonly userCell = viewChild.required<TemplateRef<CellContext<Transaction, string>>>('userCell');
  protected readonly statusCell = viewChild.required<TemplateRef<CellContext<Transaction, string>>>('statusCell');
  protected readonly amountCell = viewChild.required<TemplateRef<CellContext<Transaction, string>>>('amountCell');

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly searchForm = form(signal({ search: '' }), (schema) => debounce(schema.search, 300));

  /**
   * Filtered transactions based on search input
   */
  protected readonly filteredTransactions = computed(() => {
    const searchValue = this.searchForm.search().value().toLowerCase();
    if (!searchValue) {
      return this.transactions();
    }

    return this.transactions().filter((transaction) => {
      return (
        transaction.user.name.toLowerCase().includes(searchValue) ||
        transaction.user.email.toLowerCase().includes(searchValue) ||
        transaction.id.toLowerCase().includes(searchValue) ||
        transaction.status.toLowerCase().includes(searchValue) ||
        transaction.amount.toLowerCase().includes(searchValue)
      );
    });
  });

  /**
   * TanStack Table Column Definitions.
   * Uses `translateSignal` for reactive header translations.
   */
  protected readonly columns: ColumnDef<Transaction>[] = [
    {
      id: 'user',
      accessorKey: 'user.name',
      header: translateSignal('recentActivity.columns.user'),
      meta: { translationKey: 'dashboard2.recentActivity.columns.user' },
      enableSorting: false,
      cell: () => this.userCell(),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: translateSignal('recentActivity.columns.status'),
      meta: { translationKey: 'dashboard2.recentActivity.columns.status' },
      enableSorting: false,
      cell: () => this.statusCell(),
    },
    {
      id: 'id',
      accessorKey: 'id',
      header: translateSignal('recentActivity.columns.id'),
      meta: { translationKey: 'dashboard2.recentActivity.columns.id' },
      enableSorting: false,
      cell: (info) => `#${info.getValue()}`,
    },
    {
      id: 'date',
      accessorKey: 'date',
      header: translateSignal('recentActivity.columns.date'),
      meta: { translationKey: 'dashboard2.recentActivity.columns.date' },
      enableSorting: false,
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: translateSignal('recentActivity.columns.amount'),
      meta: { translationKey: 'dashboard2.recentActivity.columns.amount' },
      enableSorting: false,
      cell: () => this.amountCell(),
    },
  ];
}
