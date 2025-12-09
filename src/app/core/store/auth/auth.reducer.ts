import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../models/auth.models';
import {
  login,
  loginFailure,
  loginSuccess,
  register,
  registerFailure,
  registerSuccess,
} from './auth.actions';

export const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loginSuccess, (state, payload) => {
    return {
      ...state,
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      loading: false,
      error: null,
    };
  }),

  on(loginFailure, (state, payload) => ({ ...state, loading: false, error: payload.error })),

  on(register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(registerSuccess, (state, { data }) => ({
    ...state,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    loading: false,
    error: null,
  })),

  on(registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
