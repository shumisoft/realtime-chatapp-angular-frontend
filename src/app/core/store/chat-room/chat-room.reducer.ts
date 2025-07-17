import { createReducer, on } from '@ngrx/store';
import { ChatRoom } from '../../models/message.model';
import {
  clearChatRooms,
  createChatRoom,
  createChatRoomFailure,
  createChatRoomSuccess,
  deleteChatRoomSuccess,
  loadChatRoomById,
  loadChatRoomByIdFailure,
  loadChatRoomByIdSuccess,
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

  creating: boolean;
}

export const initialState: ChatRoomState = {
  rooms: [],
  selectedChatId: null,

  loading: false,
  error: null,

  page: 0,
  hasMore: false,

  creating: false,
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

  // Load Single Room by ID
  on(loadChatRoomById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadChatRoomByIdSuccess, (state, { data }) => {
    const exists = state.rooms.some((r) => r.chatId === data.chatId);

    return {
      ...state,
      loading: false,
      rooms: exists
        ? state.rooms.map((r) => (r.chatId === data.chatId ? data : r)) // Update existing
        : [...state.rooms, data], // Add new (don't use [data, ...state.rooms])
    };
  }),

  on(loadChatRoomByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Room
  on(createChatRoom, (state) => ({
    ...state,
    creating: true,
  })),

  on(createChatRoomSuccess, (state, { data }) => ({
    ...state,
    creating: false,
    rooms: [data, ...state.rooms],
  })),

  on(createChatRoomFailure, (state, { error }) => ({
    ...state,
    creating: false,
    error,
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
