import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatRoomType } from '../../models/message.model';
import { selectAllChatRooms } from '../chat-room/chat-room.selectors';
import { selectUserState } from '../users/users.selectors';
import { PresenceState } from './presence.reducer';

export const selectPresenceState = createFeatureSelector<PresenceState>('presence');

export const selectTypingUsers = (chatId: number) =>
  createSelector(
    selectPresenceState,
    (state) => state.chatActivity[chatId]?.typingUsers || new Set(),
  );

export const selectIsSomeoneTyping = (chatId: number) =>
  createSelector(selectTypingUsers(chatId), (set) => set.size > 0);

export const selectTypingDisplayText = (chatId: number, principalId: string) =>
  createSelector(
    selectPresenceState,
    selectUserState,
    selectAllChatRooms,
    (presence, usersState, rooms) => {
      const chatRoom = rooms.find((r) => r.chatId === chatId);
      if (!chatRoom) return null;

      const typingSet = presence.chatActivity[chatId]?.typingUsers;
      if (!typingSet || typingSet.size === 0) return null;

      // Remove self
      const filtered = [...typingSet].filter((id) => id !== principalId);
      if (filtered.length === 0) return null;

      // 🔥 DIRECT MESSAGE RULE
      if (chatRoom.type === ChatRoomType.DIRECT_MESSAGE) {
        return 'Typing';
      }

      // 🔥 GROUP RULES
      const names = filtered.map((id) => usersState.users[id]?.fullName || 'Someone');

      if (names.length === 1) {
        return `${names[0]} is typing`;
      }

      if (names.length === 2) {
        return `${names[0]} and ${names[1]} are typing`;
      }

      return `${names[0]} and ${names.length - 1} others are typing`;
    },
  );
