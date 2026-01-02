import { Pipe, PipeTransform } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideAlertCircle, lucideCheckCircle, lucideTrash2 } from '@ng-icons/lucide';

export type TransactionStatus = 'Suspended' | 'New' | 'Delete';

@Pipe({ name: 'transactionStatusUI' })
export class TransactionStatusUIPipe implements PipeTransform {
  transform(value: TransactionStatus) {
    const configs: Record<TransactionStatus, { icon: string; class: string }> = {
      New: { icon: 'lucideCheckCircle', class: 'text-green-600 border-green-600' },
      Suspended: { icon: 'lucideAlertCircle', class: 'text-amber-600 border-amber-600' },
      Delete: { icon: 'lucideTrash2', class: 'text-destructive border-destructive' },
    };
    return configs[value] ?? { icon: 'lucideAlertCircle', class: 'text-muted-foreground' };
  }
}

export function provideTransactionStatusIcons() {
  return provideIcons({
    lucideCheckCircle,
    lucideAlertCircle,
    lucideTrash2,
  });
}
