import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../../models/user.models';

export const selectUserState = createFeatureSelector<UserState>('principal-user');

export const selectPrincipleUser = createSelector(selectUserState, (state) => state);
