import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'chat',
    loadChildren: () => import('./features/chat/chat.routes').then((m) => m.CHAT_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
