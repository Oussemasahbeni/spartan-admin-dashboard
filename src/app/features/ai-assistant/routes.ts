import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope({ scope: 'ai-assistant', alias: 'aiAssistant' })],
    loadComponent: () => import('./pages/ai-assistant'),
  },
] as Routes;
