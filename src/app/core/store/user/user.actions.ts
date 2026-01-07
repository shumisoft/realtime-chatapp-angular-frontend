import { createAction, props } from '@ngrx/store';
import { UserDTOResponse } from '../../models/user.models';

export const getPrincipalUser = createAction('[User] Getting Principal User');
export const getPrincipalUserSuccess = createAction(
  '[User] Getting Principal User Success',
  props<{ data: UserDTOResponse }>()
);
export const getPrincipalUserFailure = createAction(
  '[User] Getting Principal User Failure',
  props<{ error: string }>()
);
