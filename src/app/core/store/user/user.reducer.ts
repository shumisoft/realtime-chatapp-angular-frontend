import { UserState } from '../../models/user.models';
import { createReducer, on } from '@ngrx/store';
import { getPrincipalUser, getPrincipalUserFailure, getPrincipalUserSuccess } from './user.actions';

export const initialState: UserState = {
  userId: null,
  username: null,
  email: null,
  fullName: null,
  avatar: null,
  bio: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,
  on(getPrincipalUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(getPrincipalUserSuccess, (state, payload) => {
    return {
      ...state,
      userId: payload.data.userId,
      username: payload.data.username,
      email: payload.data.email,
      fullName: payload.data.fullName,
      avatar: payload.data.avatar,
      bio: payload.data.bio,
      loading: false,
      error: null,
    };
  }),

  on(getPrincipalUserFailure, (state, payload) => ({
    ...state,
    loading: false,
    error: payload.error,
  }))
);
