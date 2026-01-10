import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { BuyersProfileCard } from './components/buyers-profile-card';
import { CustomersCard } from './components/customers-card';
import { SalesCard } from './components/sales-card';
import { TrafficSourceCard } from './components/traffic-source-card';
import { VisitorsCard } from './components/visitors-card';

const SCOPE = { scope: 'dashboard/dashboard1', alias: 'dashboard1' };

@Component({
  selector: 'adm-dashboard1-analytics',
  imports: [TranslocoModule, SalesCard, VisitorsCard, TrafficSourceCard, CustomersCard, BuyersProfileCard],
  templateUrl: './analytics.html',
  providers: [provideTranslocoScope(SCOPE)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsDashboard {}
