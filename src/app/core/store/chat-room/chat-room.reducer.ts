import { createReducer, on } from '@ngrx/store';
import { ChatRoom } from '../../models/chat-room.model';
import {
  clearChatRooms,
  createChatRoomSuccess,
  deleteChatRoomSuccess,
  loadMyChatRooms,
  loadMyChatRoomsFailure,
  loadMyChatRoomsSuccess,
  selectChatRoom,
  updateChatRoomSuccess,
} from './chat-room.actions';

export interface ChatRoomState {
  rooms: ChatRoom[];
  selectedChatId: number | null;

  loading: boolean;
  error: string | null;

  page: number;
  hasMore: boolean;
}

export const initialState: ChatRoomState = {
  rooms: [],
  selectedChatId: null,

  loading: false,
  error: null,

  page: 0,
  hasMore: false,
};

export const chatRoomReducer = createReducer(
  initialState,

  // Load Rooms
  on(loadMyChatRooms, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadMyChatRoomsSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    rooms: [...state.rooms, ...data.content],
    page: data.number,
    hasMore: !data.last,
  })),

  on(loadMyChatRoomsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Room
  on(createChatRoomSuccess, (state, { data }) => ({
    ...state,
    rooms: [data, ...state.rooms],
  })),

  // Update Room
  on(updateChatRoomSuccess, (state, { data }) => ({
    ...state,
    rooms: state.rooms.map((r) => (r.chatId === data.chatId ? data : r)),
  })),

  // Delete Room
  on(deleteChatRoomSuccess, (state, { chatId }) => ({
    ...state,
    rooms: state.rooms.filter((r) => r.chatId !== chatId),
  })),

  // Select
  on(selectChatRoom, (state, { chatId }) => ({
    ...state,
    selectedChatId: chatId,
  })),

  on(clearChatRooms, () => initialState),
);
