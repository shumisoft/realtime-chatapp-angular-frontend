import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../models/auth.models';
import { login, loginFailure, loginSuccess } from './auth.actions';

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
    console.log('success!', payload);

    return {
      ...state,
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
      loading: false,
      error: null,
    };
  }),

  on(loginFailure, (state, payload) => {
    console.log('error!', payload);

    return { ...state, loading: false, error: payload.error };
  })
);
