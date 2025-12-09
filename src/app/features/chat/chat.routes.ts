import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth/auth.guard';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/ui/ui').then((m) => m.Ui),
  },
];
