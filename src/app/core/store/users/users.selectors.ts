import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './users.reducer';

export const selectUserState = createFeatureSelector<UserState>('users');

export const selectUserById = (userId: string) =>
  createSelector(selectUserState, (state) => state.users[userId]);

export const selectUserColor = (userId: string) =>
  createSelector(selectUserState, (state) => state.colors[userId]);
