import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../models/auth.models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAcessToken = createSelector(selectAuthState, (state) => state.accessToken);

export const selectLoginLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectIsLoggedIn = createSelector(selectAuthState, (state) => !!state.accessToken);
