import { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';

export default [
  {
    path: '',
    providers: [provideTranslocoScope({ scope: 'file-manager', alias: 'fileManager' })],
    loadComponent: () => import('./pages/file-manager'),
  },
] as Routes;
