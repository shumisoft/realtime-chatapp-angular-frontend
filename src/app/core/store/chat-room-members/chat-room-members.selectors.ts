import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatMembersState } from './chat-room-members.reducer';

export const selectChatMembersState = createFeatureSelector<ChatMembersState>('chatMembers');

export const selectMembersByChatId = (chatId: number) =>
  createSelector(selectChatMembersState, (state) => state.membersByChatId[chatId] || []);

export const selectMembersLoading = createSelector(
  selectChatMembersState,
  (state) => state.loading,
);
