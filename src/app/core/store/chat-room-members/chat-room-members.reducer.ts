import { createReducer, on } from '@ngrx/store';
import { ChatRoomMember } from '../../models/message.model';
import {
  addMemberSuccess,
  loadMembers,
  loadMembersSuccess,
  removeMemberSuccess,
} from './chat-room-members.actions';

export interface ChatMembersState {
  membersByChatId: Record<number, ChatRoomMember[]>;
  loading: boolean;
  error: any;
}

export const initialState: ChatMembersState = {
  membersByChatId: {},
  loading: false,
  error: null,
};

export const chatRoomMembersReducer = createReducer(
  initialState,

  on(loadMembers, (state) => ({
    ...state,
    loading: true,
  })),

  on(loadMembersSuccess, (state, { chatId, members }) => ({
    ...state,
    loading: false,
    membersByChatId: {
      ...state.membersByChatId,
      [chatId]: members,
    },
  })),

  on(addMemberSuccess, (state) => ({
    ...state,
    loading: false,
  })),

  on(removeMemberSuccess, (state, { chatId, userId }) => ({
    ...state,
    membersByChatId: {
      ...state.membersByChatId,
      [chatId]: (state.membersByChatId[chatId] || []).filter((m) => m.userId !== userId),
    },
  })),
);
