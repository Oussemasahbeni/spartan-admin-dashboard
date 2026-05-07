import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { provideHlmDatePickerConfig } from '@spartan-ng/helm/date-picker';
import { format } from 'date-fns/format';

export default [
  {
    path: '',
    providers: [
      provideTranslocoScope('calendar'),
      provideHlmDatePickerConfig({
        formatDate: (date: Date) => format(date, 'dd-MM-yyyy'),
      }),
    ],
    loadComponent: () => import('./pages/calendar'),
  },
] as Routes;
