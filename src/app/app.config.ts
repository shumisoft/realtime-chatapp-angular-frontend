import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { routes } from './app.routes';
import { appEffectsProviders } from './core/config/app.effects.config';
import { appEnvProviders } from './core/config/app.env.config';
import { appInterceptorProviders } from './core/config/app.interceptors.config';
import { appStoreProviders } from './core/config/app.store.config';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(...appInterceptorProviders),
    ...appStoreProviders,
    ...appEffectsProviders,
    ...appEnvProviders,
    provideHotToastConfig(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ],
};
