import { provideStore } from '@ngrx/store';
import { authReducer } from '../store/auth/auth.reducer';
import { hydrateAuthState, hydrateChatRoomsState, hydrateUserState } from './app.hydration.config';
import { userReducer } from '../store/principal-user/principal-user.reducer';
import { chatRoomReducer } from '../store/chat-room/chat-room.reducer';
import { messageReducer } from '../store/message/message.reducer';
import { chatRoomMembersReducer } from '../store/chat-room-members/chat-room-members.reducer';
import { usersReducer } from '../store/users/users.reducer';

export const appStoreProviders = [
  provideStore(
    {
      auth: authReducer,
      'principal-user': userReducer,
      chatRooms: chatRoomReducer,
      messages: messageReducer,
      chatRoomMembers: chatRoomMembersReducer,
      users: usersReducer,
    },
    {
      initialState: {
        auth: hydrateAuthState(),
        // 'principal-user': hydrateUserState(),
        // chatRooms: hydrateChatRoomsState(),
      },
    },
  ),
];
