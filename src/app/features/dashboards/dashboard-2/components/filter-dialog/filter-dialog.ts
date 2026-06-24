import { Component, output, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCalendar, lucideFilter } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';


export interface FilterOptions {
  dateRange: string;
  status: string;
  minAmount: number | null;
  maxAmount: number | null;
}

@Component({
  selector: 'adm-filter-dialog',
  imports: [HlmDialogImports, HlmButtonImports, NgIcon, TranslocoModule],
  providers: [provideIcons({ lucideFilter, lucideCalendar })],

  template: `
    <hlm-dialog>
      <button type="button" hlmBtn variant="outline" hlmDialogTrigger>
        <ng-icon  name="lucideFilter"  />
        {{ 'dashboard2.header.filterBy' | transloco }}
      </button>
      <hlm-dialog-content *hlmDialogPortal="let ctx" class="sm:max-w-md">
        <div *transloco="let t; prefix: 'dashboard2.filter'">
          <hlm-dialog-header>
            <h3 hlmDialogTitle>{{ t('title') }}</h3>
            <p hlmDialogDescription>{{ t('description') }}</p>
          </hlm-dialog-header>
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
