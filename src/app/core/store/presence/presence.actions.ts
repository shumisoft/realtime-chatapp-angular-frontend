import { createAction, props } from '@ngrx/store';

export const userStartedTyping = createAction(
  '[Presence] User Started Typing',
  props<{ chatId: number; userId: string }>(),
);

export const userStoppedTyping = createAction(
  '[Presence] User Stopped Typing',
  props<{ chatId: number; userId: string }>(),
);

export const userTypingReceived = createAction(
  '[Presence] User Typing Received',
  props<{ chatId: number; userId: string; typing: boolean }>(),
);

export const clearChatTyping = createAction(
  '[Presence] Clear Chat Typing',
  props<{ chatId: number }>(),
);

export const clearPresence = createAction('[Presence] Clear Presence');
