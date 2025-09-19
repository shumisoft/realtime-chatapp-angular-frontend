import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from '../store/auth/auth.effects';
import { ChatMembersEffects } from '../store/chat-room-members/chat-room-members.effects';
import { ChatRoomEffects } from '../store/chat-room/chat-room.effects';
import { MessageEffects } from '../store/message/message.effects';
import { PresenceEffects } from '../store/presence/presence.effects';
import { UserEffects } from '../store/principal-user/principal-user.effects';

export const appEffectsProviders = [
  provideEffects([AuthEffects, UserEffects, ChatRoomEffects, MessageEffects, ChatMembersEffects, PresenceEffects]),
];
