import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth.models';

export const login = createAction('[Auth] Login', props<{ credentials: LoginRequest }>());

export const loginSuccess = createAction('[Auth] Login Success', props<{ data: LoginResponse }>());

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const register = createAction('[Auth] Register', props<{ payload: RegisterRequest }>());

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ data: LoginResponse }>(),
);

export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());
