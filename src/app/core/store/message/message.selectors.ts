import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MessageState } from './message.reducer';

export const selectMessageState = createFeatureSelector<MessageState>('messages');

export const selectMessagesByChatId = (chatId: number) =>
  createSelector(selectMessageState, (state) => state.messages[chatId] || []);

// Pagination metadata (page, hasMore)
export const selectChatMeta = createSelector(selectMessageState, (state) => state.meta);

export const selectChatHasMore = (chatId: number) =>
  createSelector(selectMessageState, (state) => state.meta[chatId]?.hasMore ?? false);

export const selectMessageLoading = createSelector(selectMessageState, (state) => state.loading);

export const selectMessageError = createSelector(selectMessageState, (state) => state.error);
