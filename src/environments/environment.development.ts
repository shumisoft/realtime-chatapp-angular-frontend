import { AppEnvironment } from '../app/core/models/app.models';

export const environment: AppEnvironment = {
  production: false,
  gatewayUri: 'http://127.0.0.1:5421',
  urlMaps: {
    'chatapp-fe.ritwikrajsingh.com': 'https://ritwikrajsingh.com',
    'chatapp-fe.dipanshushukla.com': 'https://dipanshushukla.com',
    localhost: 'http://localhost:3000',
  },
};
