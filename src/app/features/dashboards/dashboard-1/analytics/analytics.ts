import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'adm-dashboard1-analytics',
  imports: [],
  templateUrl: './analytics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsDashboard {
  constructor() {
    console.log('Analytics Dashboard Loaded');
  }
}
