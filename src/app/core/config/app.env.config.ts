import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface EnvConfig {
  production: boolean;
  gatewayUri: string;
}

export const ENV_CONFIG = new InjectionToken<EnvConfig>('app.config');

export const appEnvProviders = [
  {
    provide: ENV_CONFIG,
    useValue: {
      production: environment.production,
      gatewayUri: environment.gatewayUri,
    },
  },
];
