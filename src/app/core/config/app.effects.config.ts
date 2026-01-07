import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from '../store/auth/auth.effects';
import { UserEffects } from '../store/user/user.effects';

export const appEffectsProviders = [provideEffects([AuthEffects, UserEffects])];
