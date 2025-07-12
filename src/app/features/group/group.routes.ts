import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth/auth.guard';

export const GROUP_ROUTES: Routes = [
  {
    path: ':id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ui/ui').then((c) => c.Ui),
  },
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
