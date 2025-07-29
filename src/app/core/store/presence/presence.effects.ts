import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs';
import { TypingEventDTO } from '../../models/message.model';
import { MessageService } from '../../services/message/message.service';
import { loadMyChatRoomsSuccess } from '../chat-room/chat-room.actions';
import { userStartedTyping, userStoppedTyping } from './presence.actions';

@Injectable()
export class PresenceEffects {
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);
  private readonly store = inject(Store);

  private readonly SAFETY_EXPIRY_MS = 5000;
  private typingTimers = new Map<string, any>();
  private roomSubscriptions = new Map<number, any>();

  listenTypingPerRoom$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadMyChatRoomsSuccess),
        tap(({ data }) => {
          for (const room of data.content) {
            if (this.roomSubscriptions.has(room.chatId)) continue;

            const sub = this.messageService
              .listenToTyping(room.chatId)
              .subscribe((event: TypingEventDTO) => {
                this.handleTypingEvent(event);
              });

            this.roomSubscriptions.set(room.chatId, sub);
          }
        }),
      ),
    { dispatch: false },
  );

  private handleTypingEvent(event: TypingEventDTO) {
    if (!event) return;

    const key = `${event.chatId}-${event.userId}`;

    if (event.typing) {
      this.store.dispatch(
        userStartedTyping({
          chatId: event.chatId,
          userId: event.userId,
        }),
      );

      if (this.typingTimers.has(key)) {
        clearTimeout(this.typingTimers.get(key));
      }

      const timeout = setTimeout(() => {
        this.store.dispatch(
          userStoppedTyping({
            chatId: event.chatId,
            userId: event.userId,
          }),
        );
        this.typingTimers.delete(key);
      }, this.SAFETY_EXPIRY_MS);

      this.typingTimers.set(key, timeout);
    } else {
      this.store.dispatch(
        userStoppedTyping({
          chatId: event.chatId,
          userId: event.userId,
        }),
      );

      if (this.typingTimers.has(key)) {
        clearTimeout(this.typingTimers.get(key));
        this.typingTimers.delete(key);
      }
    }
  }
}
