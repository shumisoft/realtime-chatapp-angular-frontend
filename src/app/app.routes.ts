import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/chat/chat.routes').then((m) => m.CHAT_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then((m) => m.USER_ROUTES),
  },
  {
    path: 'group',
    loadChildren: () => import('./features/group/group.routes').then((m) => m.GROUP_ROUTES),
  },
  {
    path: 'me',
    redirectTo: 'user/me',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
