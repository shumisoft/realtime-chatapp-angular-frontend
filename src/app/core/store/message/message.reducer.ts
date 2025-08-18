import { createReducer, on } from '@ngrx/store';
import * as MessageActions from './message.actions';
import { Message, MessageStatus } from '../../models/message.model';

export interface ChatMessageMeta {
  page: number; // Next page to request
  hasMore: boolean; // If older messages exist
}

export interface MessageState {
  messages: Record<number, Message[]>; // chatId → messages
  meta: Record<number, ChatMessageMeta>; // chatId → pagination info
  loading: boolean;
  error: string | null;
}

export const initialState: MessageState = {
  messages: {},
  meta: {},
  loading: false,
  error: null,
};

export const messageReducer = createReducer(
  initialState,

  //
  // INITIAL LOAD
  //
  on(MessageActions.loadInitialMessages, (state) => ({
    ...state,
    loading: true,
  })),

  on(MessageActions.loadInitialMessagesSuccess, (state, { chatId, messages, hasMore }) => ({
    ...state,
    loading: false,
    messages: { ...state.messages, [chatId]: messages },
    meta: { ...state.meta, [chatId]: { page: 1, hasMore } },
  })),

  //
  // PAGINATION
  //
  on(MessageActions.loadOlderMessagesSuccess, (state, { chatId, messages, hasMore }) => {
    const existing = state.messages[chatId] || [];

    // Prepend older messages
    const combined = [...messages, ...existing];

    return {
      ...state,
      messages: { ...state.messages, [chatId]: combined },
      meta: {
        ...state.meta,
        [chatId]: {
          page: state.meta[chatId]?.page + 1,
          hasMore,
        },
      },
    };
  }),

  //
  // CREATE & WS MESSAGE
  //
  on(MessageActions.createMessageSuccess, (state, { message }) => {
    const list = state.messages[message.chatRoomId] || [];
    if (list.some((m) => m.messageId === message.messageId)) return state;

    return {
      ...state,
      messages: {
        ...state.messages,
        [message.chatRoomId]: [...list, message],
      },
    };
  }),

  on(MessageActions.incomingWsMessage, (state, { message }) => {
    const list = state.messages[message.chatRoomId] || [];
    if (list.some((m) => m.messageId === message.messageId)) return {
        // Update existing message (status change, etc.)
        ...state,
        messages: {
          ...state.messages,
          [message.chatRoomId]: list.map((m) => (m.messageId === message.messageId ? message : m)),
        },
      };

    return {
      ...state,
      messages: {
        ...state.messages,
        [message.chatRoomId]: [...list, message],
      },
    };
  }),

  //
  // STATUS UPDATE
  //
  on(MessageActions.updateMessageSuccess, (state, { message }) => {
    const updated: Record<number, Message[]> = {};

    for (const chatId in state.messages) {
      updated[+chatId] = state.messages[chatId].map((m) =>
        m.messageId === message.messageId ? { ...m, status: message.status } : m,
      );
    }

    return { ...state, messages: updated };
  }),
);
