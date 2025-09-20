import { AppEnvironment } from '../app/core/models/app.models';

export const environment: AppEnvironment = {
  production: true,
  gatewayUri: 'https://chatapp-be.dipanshushukla.com',
  urlMaps: {
    'chatapp-fe.ritwikrajsingh.com': 'https://ritwikrajsingh.com',
    'chatapp-fe.dipanshushukla.com': 'https://dipanshushukla.com',
  },
};
