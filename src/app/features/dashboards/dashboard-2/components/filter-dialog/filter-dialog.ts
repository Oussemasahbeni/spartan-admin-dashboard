import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideFilter } from '@ng-icons/lucide';
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
  imports: [HlmDialogImports, HlmButtonImports, HlmIconImports, TranslocoModule],
  providers: [provideIcons({ lucideFilter, lucideCalendar })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <hlm-dialog>
      <button type="button" hlmBtn variant="outline" hlmDialogTrigger>
        <ng-icon hlmIcon name="lucideFilter" size="sm" />
        {{ 'dashboard2.header.filterBy' | transloco }}
      </button>
      <hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-md">
        <div *transloco="let t; prefix: 'dashboard2.filter'">
          <hlm-dialog-header>
            <h3 hlmDialogTitle>{{ t('title') }}</h3>
            <p hlmDialogDescription>{{ t('description') }}</p>
          </hlm-dialog-header>
          <div class="space-y-4 py-4">
            <p class="text-muted-foreground text-sm">{{ t('description') }}</p>
          </div>
          <hlm-dialog-footer>
            <button type="button" hlmBtn variant="outline" hlmDialogClose>{{ t('reset') }}</button>
            <button type="button" hlmBtn hlmDialogClose (click)="onApply()">{{ t('apply') }}</button>
          </hlm-dialog-footer>
        </div>
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class FilterDialogComponent {
  // ==========================================
  // Outputs
  // ==========================================

  public readonly filterApplied = output<FilterOptions>();

  // ==========================================
  // State
  // ==========================================

  protected readonly isOpen = signal(false);

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
