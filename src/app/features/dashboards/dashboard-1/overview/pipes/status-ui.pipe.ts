import { Pipe, PipeTransform } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCircleCheck, lucideCircleX, lucideLoader } from '@ng-icons/lucide';
import { PaymentStatus } from '../model/payment';

@Pipe({ name: 'statusUI' })
export class PaymentStatusUIPipe implements PipeTransform {
  transform(value: PaymentStatus) {
    const configs: Record<PaymentStatus, { icon: string; class: string }> = {
      success: { icon: 'lucideCircleCheck', class: 'text-green-600 ' },
      failed: { icon: 'lucideCircleX', class: 'text-destructive border-destructive' },
      processing: { icon: 'lucideLoader', class: 'text-amber-600 border-amber-600' },
    };
    return configs[value] ?? { icon: 'lucideCircleHelp', class: 'text-muted-foreground' };
  }
}

export function providePaymentStatusIcons() {
  return provideIcons({
    lucideCircleCheck,
    lucideCircleX,
    lucideLoader,
  });
}
