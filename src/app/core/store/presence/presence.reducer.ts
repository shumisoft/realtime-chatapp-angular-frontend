import { createReducer, on } from '@ngrx/store';
import { clearPresence, userStartedTyping, userStoppedTyping } from './presence.actions';

export interface ChatActivity {
  typingUsers: Set<string>;
}

export interface PresenceState {
  chatActivity: Record<number, ChatActivity>;
}

export const initialState: PresenceState = {
  chatActivity: {},
};

export const presenceReducer = createReducer(
  initialState,

  on(userStartedTyping, (state, { chatId, userId }) => {
    const current = state.chatActivity[chatId]?.typingUsers || new Set();

    if (current.has(userId)) return state;

    const updatedSet = new Set(current);

    updatedSet.add(userId);

    return {
      ...state,
      chatActivity: {
        ...state.chatActivity,
        [chatId]: { typingUsers: updatedSet },
      },
    };
  }),

  on(userStoppedTyping, (state, { chatId, userId }) => {
    const current = state.chatActivity[chatId]?.typingUsers || new Set();

    if (!current.has(userId)) return state;

    const updatedSet = new Set(current);

    updatedSet.delete(userId);

    return {
      ...state,
      chatActivity: {
        ...state.chatActivity,
        [chatId]: { typingUsers: updatedSet },
      },
    };
  }),

  on(clearPresence, () => initialState),
);
