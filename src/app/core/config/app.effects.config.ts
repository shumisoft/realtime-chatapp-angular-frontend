import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from '../store/auth/auth.effects';
import { UserEffects } from '../store/user/user.effects';
import { ChatRoomEffects } from '../store/chat-room/chat-room.effects';
import { MessageEffects } from '../store/message/message.effects';

export const appEffectsProviders = [
  provideEffects([AuthEffects, UserEffects, ChatRoomEffects, MessageEffects]),
];
