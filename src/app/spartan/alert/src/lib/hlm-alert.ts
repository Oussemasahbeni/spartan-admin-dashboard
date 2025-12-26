import { Directive, computed, input } from '@angular/core';
import { hlm } from '@spartan-ng/helm/utils';
import { type VariantProps, cva } from 'class-variance-authority';
import type { ClassValue } from 'clsx';

const alertVariants = cva(
  'relative w-full items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>[hlmAlertIcon]]:grid has-[>[hlmAlertIcon]]:grid-cols-[calc(theme(spacing.1)*4)_1fr] has-[>[hlmAlertIcon]]:gap-x-3 [&>[hlmAlertIcon]]:size-4 [&>[hlmAlertIcon]]:translate-y-0.5 [&>[hlmAlertIcon]]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        success:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400 [&>[hlmAlertDescription]]:text-green-700 dark:[&>[hlmAlertDescription]]:text-green-300 [&>[hlmAlertDesc]]:text-green-700 dark:[&>[hlmAlertDesc]]:text-green-300 [&>[hlmAlertIcon]]:text-green-600 dark:[&>[hlmAlertIcon]]:text-green-400',
        destructive:
          'text-destructive bg-card [&>[hlmAlertDescription]]:text-destructive/90 [&>[hlmAlertDesc]]:text-destructive/90 [&>[hlmAlertIcon]]:text-current',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertVariants = VariantProps<typeof alertVariants>;

@Directive({
  selector: '[hlmAlert]',
  host: {
    role: 'alert',
    '[class]': '_computedClass()',
  },
})
export class HlmAlert {
  public readonly userClass = input<ClassValue>('', { alias: 'class' });
  protected readonly _computedClass = computed(() =>
    hlm(alertVariants({ variant: this.variant() }), this.userClass()),
  );

  public readonly variant = input<AlertVariants['variant']>('default');
}
