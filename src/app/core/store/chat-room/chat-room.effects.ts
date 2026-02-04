import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';

import {
  loadMyChatRooms,
  loadMyChatRoomsFailure,
  loadMyChatRoomsSuccess,
  createChatRoom,
  createChatRoomFailure,
  createChatRoomSuccess,
  updateChatRoom,
  updateChatRoomFailure,
  updateChatRoomSuccess,
  deleteChatRoom,
  deleteChatRoomFailure,
  deleteChatRoomSuccess,
} from './chat-room.actions';

export class ChatRoomEffects {
  private readonly actions = inject(Actions);
  private readonly chatService = inject(ChatRoomService);
  private readonly toast = inject(HotToastService);

  loadMyRooms$ = createEffect(() =>
    this.actions.pipe(
      ofType(loadMyChatRooms),
      mergeMap(({ page, size }) =>
        this.chatService.getMyRooms(page, size).pipe(
          map((data) => loadMyChatRoomsSuccess({ data })),
          catchError((err) =>
            of(loadMyChatRoomsFailure({ error: err?.error?.message || 'Failed to load rooms' })),
          ),
        ),
      ),
    ),
  );

  createRoom$ = createEffect(() =>
    this.actions.pipe(
      ofType(createChatRoom),
      exhaustMap(({ payload }) =>
        this.chatService.create(payload).pipe(
          map((data) => {
            this.toast.success('Chat room created');
            return createChatRoomSuccess({ data });
          }),
          catchError((err) =>
            of(createChatRoomFailure({ error: err?.error?.message || 'Failed to create room' })),
          ),
        ),
      ),
    ),
  );

  updateRoom$ = createEffect(() =>
    this.actions.pipe(
      ofType(updateChatRoom),
      exhaustMap(({ chatId, payload }) =>
        this.chatService.update(chatId, payload).pipe(
          map((data) => {
            this.toast.success('Chat room updated');
            return updateChatRoomSuccess({ data });
          }),
          catchError((err) =>
            of(updateChatRoomFailure({ error: err?.error?.message || 'Failed to update room' })),
          ),
        ),
      ),
    ),
  );

  deleteRoom$ = createEffect(() =>
    this.actions.pipe(
      ofType(deleteChatRoom),
      exhaustMap(({ chatId }) =>
        this.chatService.delete(chatId).pipe(
          map(() => {
            this.toast.success('Chat room deleted');
            return deleteChatRoomSuccess({ chatId });
          }),
          catchError((err) =>
            of(deleteChatRoomFailure({ error: err?.error?.message || 'Failed to delete room' })),
          ),
        ),
      ),
    ),
  );
}
