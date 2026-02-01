import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideFilter } from '@ng-icons/lucide';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmIconImports } from '@spartan-ng/helm/icon';

export interface FilterOptions {
  dateRange: string;
  status: string;
  minAmount: number | null;
  maxAmount: number | null;
}

@Component({
  selector: 'adm-filter-dialog',
  imports: [BrnDialogImports, HlmDialogImports, HlmButtonImports, HlmIconImports, TranslocoModule],
  providers: [provideIcons({ lucideFilter, lucideCalendar })],
  template: `
    <hlm-dialog>
      <button type="button" hlmBtn variant="outline" hlmDialogTrigger>
        <ng-icon hlmIcon name="lucideFilter" size="sm" />
        {{ 'dashboard2.header.filterBy' | transloco }}
      </button>
      <hlm-dialog-content *transloco="let t; prefix: 'dashboard2.filter'" class="sm:max-w-md">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ t('title') }}</h3>
          <p hlmDialogDescription>{{ t('description') }}</p>
        </hlm-dialog-header>
        <div class="space-y-4 py-4">
          <p class="text-muted-foreground text-sm">{{ t('description') }}</p>
        </div>
        <hlm-dialog-footer>
          <button type="button" hlmBtn variant="outline" brnDialogClose>{{ t('reset') }}</button>
          <button type="button" hlmBtn brnDialogClose (click)="onApply()">{{ t('apply') }}</button>
        </hlm-dialog-footer>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterDialogComponent {
  // ==========================================
  // Outputs
  // ==========================================

  readonly filterApplied = output<FilterOptions>();

  // ==========================================
  // State
  // ==========================================

  readonly isOpen = signal(false);

  // ==========================================
  // Public Methods
  // ==========================================

  onApply() {
    this.filterApplied.emit({
      dateRange: 'all',
      status: 'all',
      minAmount: null,
      maxAmount: null,
    });
  }
}
