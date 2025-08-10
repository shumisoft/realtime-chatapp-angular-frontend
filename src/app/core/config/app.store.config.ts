import { MetaReducer, provideStore } from '@ngrx/store';
import { clearAppStateMetaReducer } from '../store/app.meta.reducer';
import { authReducer } from '../store/auth/auth.reducer';
import { chatRoomMembersReducer } from '../store/chat-room-members/chat-room-members.reducer';
import { chatRoomReducer } from '../store/chat-room/chat-room.reducer';
import { messageReducer } from '../store/message/message.reducer';
import { presenceReducer } from '../store/presence/presence.reducer';
import { userReducer } from '../store/principal-user/principal-user.reducer';
import { usersReducer } from '../store/users/users.reducer';
import { hydrateAuthState } from './app.hydration.config';

export const metaReducers: MetaReducer[] = [clearAppStateMetaReducer];

export const appStoreProviders = [
  provideStore(
    {
      auth: authReducer,
      'principal-user': userReducer,
      chatRooms: chatRoomReducer,
      messages: messageReducer,
      chatRoomMembers: chatRoomMembersReducer,
      users: usersReducer,
      presence: presenceReducer,
    },
    {
      initialState: {
        auth: hydrateAuthState(),
        // 'principal-user': hydrateUserState(),
        // chatRooms: hydrateChatRoomsState(),
      },
      metaReducers,
    },
  ),
];
