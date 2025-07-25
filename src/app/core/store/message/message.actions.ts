import { createAction, props } from '@ngrx/store';
import { Message } from '../../models/message.model';

//
// LOAD INITIAL MESSAGES (FIRST PAGE)
//
export const loadInitialMessages = createAction(
  '[Messages] Load Initial Messages',
  props<{ chatId: number }>(),
);

export const loadInitialMessagesSuccess = createAction(
  '[Messages] Load Initial Messages Success',
  props<{ chatId: number; messages: Message[]; hasMore: boolean }>(),
);

export const loadInitialMessagesFailure = createAction(
  '[Messages] Load Initial Messages Failure',
  props<{ error: any }>(),
);

//
// LOAD OLDER MESSAGES (PAGINATION)
//
export const loadOlderMessages = createAction(
  '[Messages] Load Older Messages',
  props<{ chatId: number }>(),
);

export const loadOlderMessagesSuccess = createAction(
  '[Messages] Load Older Messages Success',
  props<{ chatId: number; messages: Message[]; hasMore: boolean }>(),
);

export const loadOlderMessagesFailure = createAction(
  '[Messages] Load Older Messages Failure',
  props<{ error: any }>(),
);

//
// CREATE MESSAGE (REST)
//
export const createMessage = createAction(
  '[Messages] Create Message',
  props<{ chatId: number; dto: Partial<Message> }>(),
);

export const createMessageSuccess = createAction(
  '[Messages] Create Message Success',
  props<{ message: Message }>(),
);

export const createMessageFailure = createAction(
  '[Messages] Create Message Failure',
  props<{ error: any }>(),
);

//
// INCOMING REALTIME MESSAGE (WS)
//
export const incomingWsMessage = createAction(
  '[Messages] Incoming WS Message',
  props<{ message: Message }>(),
);

//
// UPDATE STATUS
//
export const updateMessage = createAction(
  '[Messages] Update Message',
  props<{ message: Message }>(),
);

export const updateMessageSuccess = createAction(
  '[Messages] Update Message Success',
  props<{ message: Message }>(),
);

export const updateMessageFailure = createAction(
  '[Messages] Update Message Failure',
  props<{ error: any }>(),
);
