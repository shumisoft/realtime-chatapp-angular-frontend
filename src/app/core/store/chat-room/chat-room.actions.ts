import { createAction, props } from '@ngrx/store';
import {
  ChatRoom,
  CreateChatRoomRequest,
  Message,
  PaginatedChatRooms,
} from '../../models/message.model';
// Load paginated user chat rooms (lazy scroll)
export const loadMyChatRooms = createAction(
  '[ChatRoom] Load My ChatRooms',
  props<{ page: number; size: number }>(),
);

export const loadMyChatRoomsSuccess = createAction(
  '[ChatRoom] Load My ChatRooms Success',
  props<{ data: PaginatedChatRooms }>(),
);

export const loadMyChatRoomsFailure = createAction(
  '[ChatRoom] Load My ChatRooms Failure',
  props<{ error: string }>(),
);

// load single chat room
export const loadChatRoomById = createAction(
  '[ChatRoom] Load ChatRoom By ID',
  props<{ chatId: number }>(),
);

export const loadChatRoomByIdSuccess = createAction(
  '[ChatRoom] Load ChatRoom By ID Success',
  props<{ data: ChatRoom }>(),
);

export const loadChatRoomByIdFailure = createAction(
  '[ChatRoom] Load ChatRoom By ID Failure',
  props<{ error: string }>(),
);

// Create
export const createChatRoom = createAction(
  '[ChatRoom] Create ChatRoom',
  props<{ payload: CreateChatRoomRequest }>(),
);

export const createChatRoomSuccess = createAction(
  '[ChatRoom] Create ChatRoom Success',
  props<{ data: ChatRoom }>(),
);

export const createChatRoomFailure = createAction(
  '[ChatRoom] Create ChatRoom Failure',
  props<{ error: string }>(),
);

// Update
export const updateChatRoom = createAction(
  '[ChatRoom] Update ChatRoom',
  props<{ chatId: number; payload: Partial<ChatRoom> }>(),
);

export const updateChatRoomSuccess = createAction(
  '[ChatRoom] Update ChatRoom Success',
  props<{ data: ChatRoom }>(),
);

export const updateChatRoomFailure = createAction(
  '[ChatRoom] Update ChatRoom Failure',
  props<{ error: string }>(),
);

export const updateChatRoomLatestMessage = createAction(
  '[ChatRoom] Update ChatRoom Latest Message',
  props<{ message: Message }>(),
);

// Delete
export const deleteChatRoom = createAction(
  '[ChatRoom] Delete ChatRoom',
  props<{ chatId: number }>(),
);

export const deleteChatRoomSuccess = createAction(
  '[ChatRoom] Delete ChatRoom Success',
  props<{ chatId: number }>(),
);

export const deleteChatRoomFailure = createAction(
  '[ChatRoom] Delete ChatRoom Failure',
  props<{ error: string }>(),
);

// UI
export const selectChatRoom = createAction(
  '[ChatRoom] Select ChatRoom',
  props<{ chatId: number | null }>(),
);

export const clearChatRooms = createAction('[ChatRoom] Clear ChatRooms');
