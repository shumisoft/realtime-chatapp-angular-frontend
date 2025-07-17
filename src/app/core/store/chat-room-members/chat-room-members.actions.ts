import { createAction, props } from '@ngrx/store';
import { ChatRoomMember } from '../../models/message.model';

/** Load members of a specific chat room */
export const loadMembers = createAction('[Chat Members] Load Members', props<{ chatId: number }>());

export const loadMembersSuccess = createAction(
  '[Chat Members] Load Members Success',
  props<{ chatId: number; members: ChatRoomMember[] }>(),
);

export const loadMembersFailure = createAction(
  '[Chat Members] Load Members Failure',
  props<{ chatId: number; error: any }>(),
);

/** Add member */
export const addMember = createAction(
  '[Chat Members] Add Member',
  props<{ chatId: number; userId: string }>(), // don't be savage
);

export const addMemberSuccess = createAction(
  '[Chat Members] Add Member Success',
  props<{ chatId: number }>(),
);

/** Remove member */
export const removeMember = createAction(
  '[Chat Members] Remove Member',
  props<{ chatId: number; userId: string }>(),
);

export const removeMemberSuccess = createAction(
  '[Chat Members] Remove Member Success',
  props<{ chatId: number; userId: string }>(),
);
