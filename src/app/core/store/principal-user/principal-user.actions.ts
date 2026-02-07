import { createAction, props } from '@ngrx/store';
import { EditUserRequest, UserDTOResponse, UserState } from '../../models/user.models';

export const getPrincipalUser = createAction('[User] Getting Principal User');
export const getPrincipalUserSuccess = createAction(
  '[User] Getting Principal User Success',
  props<{ data: UserState }>(),
);
export const getPrincipalUserFailure = createAction(
  '[User] Getting Principal User Failure',
  props<{ error: string }>(),
);

export const updatePrincipalUser = createAction(
  '[User] Update Principal User',
  props<{ payload: EditUserRequest }>(),
);

export const updatePrincipalUserSuccess = createAction(
  '[User] Update Principal User Success',
  props<{ data: UserState }>(),
);

export const updatePrincipalUserFailure = createAction(
  '[User] Update Principal User Failure',
  props<{ error: string }>(),
);
