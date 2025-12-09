import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection, isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { routes } from './app.routes';
import { appEffectsProviders } from './core/config/app.effects.config';
import { appInterceptorProviders } from './core/config/app.interceptors.config';
import { appStoreProviders } from './core/config/app.store.config';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(...appInterceptorProviders),
    ...appStoreProviders,
    ...appEffectsProviders,
    provideHotToastConfig(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
],
};
