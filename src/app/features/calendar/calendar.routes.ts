import { Routes } from '@angular/router';

export default [
    {
        path: '',
        loadComponent: () => import('./calendar')
    }
] as Routes;
