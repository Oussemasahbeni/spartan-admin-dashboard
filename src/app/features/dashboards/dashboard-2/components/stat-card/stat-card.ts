import { Component, input, output } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { NgIcon } from '@ng-icons/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';

export interface StatCardData {
  icon: string;
  labelKey: string;
  value: string;
  changePercent: string;
  changeDescriptionKey: string;
  isPositive: boolean;
}

@Component({
  selector: 'adm-stat-card',
  imports: [HlmButtonImports, HlmCardImports, NgIcon, TranslocoModule],

  template: `
    <section *transloco="let t; prefix: 'dashboard2.stats'" hlmCard class="h-full w-full">
      <div hlmCardContent class="flex h-full flex-col justify-between">
        <div class="mb-4 flex items-start justify-between">
          <ng-icon [name]="data().icon" />
          <button type="button" hlmBtn variant="ghost" size="icon" (click)="menuClick.emit()">
            <ng-icon name="lucideMoreHorizontal" />
          </button>
        </div>
        <div>
          <span class="text-muted-foreground text-sm font-medium">{{ t(data().labelKey) }}</span>
          <div class="mt-1 text-2xl font-bold">{{ data().value }}</div>
          <div
            class="mt-2 flex items-center gap-1 text-xs font-bold"
            [class.text-success]="data().isPositive"
            [class.text-destructive]="!data().isPositive"
          >
            <span>{{ data().changePercent }}</span>
            <ng-icon
              [class.text-success]="data().isPositive"
              [class.text-destructive]="!data().isPositive"
              [name]="data().isPositive ? 'lucideTrendingUp' : 'lucideTrendingDown'"
            />
            <span class="text-muted-foreground ml-1 font-normal">{{ t(data().changeDescriptionKey) }}</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StatCardComponent {
  // ==========================================
  // Inputs
  // ==========================================

  public readonly data = input.required<StatCardData>();

  // ==========================================
  // Outputs
  // ==========================================

  public readonly menuClick = output<void>();
}
