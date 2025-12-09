import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from '../store/auth/auth.effects';

export const appEffectsProviders = [provideEffects([AuthEffects])];
