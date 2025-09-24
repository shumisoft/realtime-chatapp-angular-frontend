import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatRoomState } from './chat-room.reducer';

export const selectChatRoomState = createFeatureSelector<ChatRoomState>('chatRooms');

export const selectAllChatRooms = createSelector(selectChatRoomState, (state) => state.rooms);

export const selectChatRoomsSorted = createSelector(selectAllChatRooms, (rooms) =>
  [...rooms].sort((a, b) => {
    const t1 = a.latestMessage?.timestamp ?? a.createdAt ?? '';
    const t2 = b.latestMessage?.timestamp ?? b.createdAt ?? '';
    return t2.localeCompare(t1);
  }),
);

export const selectSelectedChatRoomId = createSelector(
  selectChatRoomState,
  (state) => state.selectedChatId,
);

export const selectSelectedChatRoom = createSelector(
  selectAllChatRooms,
  selectSelectedChatRoomId,
  (rooms, id) => rooms.find((r) => r.chatId === id) ?? null,
);

export const selectChatRoomLoading = createSelector(selectChatRoomState, (state) => state.loading);

export const selectChatRoomError = createSelector(selectChatRoomState, (state) => state.error);

export const selectHasMoreChatRooms = createSelector(selectChatRoomState, (state) => state.hasMore);

//Get room by specific ID
export const selectChatRoomById = (chatId: number) =>
  createSelector(selectAllChatRooms, (rooms) => rooms.find((r) => r.chatId === chatId) ?? null);

export const selectChatRoomCreating = createSelector(
  selectChatRoomState,
  (state) => state.creating,
);

//Check if we've attempted to load a specific room
export const selectChatRoomLoadAttempted = (chatId: number) =>
  createSelector(selectChatRoomState, (state) => !!state.loadedChatIds[chatId]);
