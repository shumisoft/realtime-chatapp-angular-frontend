import { provideStore } from '@ngrx/store';
import { authReducer } from '../store/auth/auth.reducer';
import { hydrateAuthState, hydrateChatRoomsState, hydrateUserState } from './app.hydration.config';
import { userReducer } from '../store/user/user.reducer';
import { chatRoomReducer } from '../store/chat-room/chat-room.reducer';

export const appStoreProviders = [
  provideStore(
    { auth: authReducer, 'principal-user': userReducer, chatRooms: chatRoomReducer },
    {
      initialState: {
        auth: hydrateAuthState(),
        'principal-user': hydrateUserState(),
        // chatRooms: hydrateChatRoomsState(),
      },
    },
  ),
];
