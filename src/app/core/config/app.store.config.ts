import { provideStore } from '@ngrx/store';
import { authReducer } from '../store/auth/auth.reducer';
import { hydrateAuthState } from './app.hydration.config';

export const appStoreProviders = [
  provideStore({ auth: authReducer }, { initialState: { auth: hydrateAuthState() } }),
];
