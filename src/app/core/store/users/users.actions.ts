import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.models';

export const upsertUser = createAction('[Users] Upsert User', props<{ user: User }>());
