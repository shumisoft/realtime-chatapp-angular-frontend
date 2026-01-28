import { provideStore } from '@ngrx/store';
import { authReducer } from '../store/auth/auth.reducer';
import { hydrateAuthState, hydrateUserState } from './app.hydration.config';
import { userReducer } from '../store/user/user.reducer';

export const appStoreProviders = [
  provideStore(
    { auth: authReducer, 'principal-user': userReducer },
    { initialState: { auth: hydrateAuthState(), 'principal-user': hydrateUserState() } }
  ),
];
