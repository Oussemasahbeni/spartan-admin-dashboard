import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { Transaction } from '../../model/dashboard-2';
import { TransactionStatusUIPipe } from '../../pipes/status-ui.pipe';

@Component({
  selector: 'adm-transactions-table',
  imports: [HlmBadgeImports, HlmButtonImports, HlmIconImports, TransactionStatusUIPipe, NgOptimizedImage],
  templateUrl: './transactions-table.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  readonly transactions = input.required<Transaction[]>();
}
