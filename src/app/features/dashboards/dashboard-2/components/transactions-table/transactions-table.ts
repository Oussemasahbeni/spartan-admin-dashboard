import { Component, computed, input, signal, TemplateRef, viewChild } from '@angular/core';
import { translateSignal, TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX, lucideLoader, lucideSearch, lucideX } from '@ng-icons/lucide';
import { DataTableColumnsManager } from '@shared/datatable/columns-manager/columns-manager';
import { DataTable } from '@shared/datatable/table/data-table';
import { DataTableFeatures } from '@shared/datatable/table/table-features';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { CellContext, createColumnHelper } from '@tanstack/angular-table';
import { Transaction } from '../../model/dashboard-2';

@Component({
  selector: 'adm-transactions-table',
  imports: [
    HlmAvatarImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmCardImports,
    HlmInputImports,
    HlmInputGroupImports,
    NgIcon,
    TranslocoModule,
    DataTable,
    DataTableColumnsManager,
  ],
  providers: [
    provideIcons({
      lucideSearch,
      lucideX,
      lucideCircleCheck,
      lucideCircleX,
      lucideLoader,
    }),
  ],
  template: `
    <section *transloco="let t; prefix: 'dashboard2.recentActivity'" hlmCard class="h-full w-full">
      <div hlmCardHeader>
        <h3 hlmCardTitle>{{ t('title') }}</h3>
        <p hlmCardDescription>{{ t('description') }}</p>
      </div>
      <div hlmCardContent>
        <div class="mb-4 flex items-center justify-between gap-4">
          <hlm-input-group>
            <input
              *transloco="let t"
              class="w-full md:w-80"
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
                <button type="button" hlmBtn variant="ghost" size="icon-sm" (click)="_clearSearch()">
                  <span class="sr-only">{{ t('common.clearSearch') }}</span>
                  <ng-icon name="lucideX" />
                </button>
              }
            </hlm-input-group-addon>
          </hlm-input-group>

          <adm-data-table-column-manager [table]="table()" />
        </div>

        <adm-data-table
          [columns]="columns"
          [data]="transactions()"
          [pagination]="{ pageIndex: 0, pageSize: 5 }"
          [pageSizeOptions]="[5, 10, 25]"
        >
          <!-- User Cell -->
          <ng-template #userCell let-context>
            <div class="flex items-center gap-3">
              <hlm-avatar>
                <img hlmAvatarImage [src]="context.row.original.user.avatar" [alt]="context.row.original.user.name" />
                <span class="bg-destructive text-white" hlmAvatarFallback>
                  {{ context.row.original.user.name.charAt(0) + context.row.original.user.name.charAt(1).toUpperCase() }}
                </span>
              </hlm-avatar>
              <div>
                <div class="text-foreground font-medium">{{ context.row.original.user.name }}</div>
                <div class="text-muted-foreground text-xs">{{ context.row.original.user.email }}</div>
              </div>
            </div>
          </ng-template>

          <!-- Status Cell -->
          <ng-template #statusCell let-context>
            <span hlmBadge variant="outline" class="text-muted-foreground">
              @let status = context.getValue();
              @switch (status) {
                @case ('success') {
                  <ng-icon class="text-green-600" name="lucideCircleCheck" />
                }
                @case ('failed') {
                  <ng-icon class="text-destructive" name="lucideCircleX" />
                }
                @case ('processing') {
                  <ng-icon class="animate-spin text-yellow-600" name="lucideLoader" />
                }
                @default {
                  <ng-icon class="animate-spin text-yellow-600" name="lucideLoader" />
                }
              }
              <span *transloco="let t; prefix: 'dashboard2.recentActivity.status'">{{ t(status) }}</span>
            </span>
          </ng-template>

          <!-- Amount Cell -->
          <ng-template #amountCell let-context>
            <div class="font-medium">{{ context.getValue() }}</div>
          </ng-template>
        </adm-data-table>
      </div>
    </section>
  `,
})
export class TransactionsTableComponent {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly transactions = input.required<Transaction[]>();

  // ==========================================
  // View Children
  // ==========================================

  protected readonly dataTable = viewChild.required(DataTable<Transaction>);
  protected readonly userCell =
    viewChild.required<TemplateRef<CellContext<DataTableFeatures, Transaction, string>>>('userCell');
  protected readonly statusCell =
    viewChild.required<TemplateRef<CellContext<DataTableFeatures, Transaction, Transaction['status']>>>('statusCell');
  protected readonly amountCell =
    viewChild.required<TemplateRef<CellContext<DataTableFeatures, Transaction, string>>>('amountCell');

  // ==========================================
  // State
  // ==========================================

  protected readonly table = computed(() => this.dataTable().table);
  protected readonly searchValue = signal('');

  /**
   * TanStack Table Column Definitions.
   */
  private readonly columnHelper = createColumnHelper<DataTableFeatures, Transaction>();

  protected readonly columns = this.columnHelper.columns([
    this.columnHelper.accessor('user.name', {
      id: 'user',
      header: translateSignal('recentActivity.columns.user'),
      meta: () => ({ translationKey: 'dashboard2.recentActivity.columns.user' }),
      enableSorting: true,
      cell: () => this.userCell(),
    }),
    this.columnHelper.accessor('status', {
      header: translateSignal('recentActivity.columns.status'),
      meta: () => ({ translationKey: 'dashboard2.recentActivity.columns.status' }),
      enableSorting: true,
      cell: () => this.statusCell(),
    }),
    this.columnHelper.accessor('id', {
      header: translateSignal('recentActivity.columns.id'),
      meta: () => ({ translationKey: 'dashboard2.recentActivity.columns.id' }),
      enableSorting: true,
      cell: (info) => `#${info.getValue()}`,
    }),
    this.columnHelper.accessor('date', {
      header: translateSignal('recentActivity.columns.date'),
      meta: () => ({ translationKey: 'dashboard2.recentActivity.columns.date' }),
      enableSorting: true,
    }),
    this.columnHelper.accessor('amount', {
      header: translateSignal('recentActivity.columns.amount'),
      meta: () => ({ translationKey: 'dashboard2.recentActivity.columns.amount' }),
      enableSorting: false,
      cell: () => this.amountCell(),
    }),
  ]);

  // ==========================================
  // Public Methods
  // ==========================================

  protected _filterChanged(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
    this.table().getColumn('email')?.setFilterValue(value);
  }
  protected _clearSearch() {
    this.searchValue.set('');
    this.table().getColumn('email')?.setFilterValue('');
  }
}
