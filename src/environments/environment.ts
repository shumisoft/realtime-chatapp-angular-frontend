import { AppEnvironment } from '../app/core/models/app.models';

export const environment: AppEnvironment = {
  production: true,
  gatewayUri: 'https://chatapp-be.dipanshushukla.com',
  urlMaps: {
    'chatapp-be.ritwikrajsingh.com': 'https://ritwikrajsingh.com',
    'chatapp-be.dipanshushukla.com': 'https://dipanshushukla.com',
  },
};
