import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ChatRoomService } from '../../services/chat-room/chat-room.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMap } from 'rxjs/operators';

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
  loadChatRoomById,
  loadChatRoomByIdSuccess,
  loadChatRoomByIdFailure,
} from './chat-room.actions';

import { upsertUser } from '../users/users.actions';
import { ChatRoom } from '../../models/message.model';

@Injectable()
export class ChatRoomEffects {
  private readonly actions$ = inject(Actions);
  private readonly chatService = inject(ChatRoomService);
  private readonly toast = inject(HotToastService);

  /** Extract all users from a ChatRoom */
  private extractUsersFromRoom(room: ChatRoom) {
    const users = [];

    if (room.members?.length) {
      for (const member of room.members) {
        if (member.user) {
          users.push(member.user);
        }
      }
    }

    return users;
  }

  /** Extract all users from paginated results */
  private extractUsersFromRooms(data: { content: ChatRoom[] }) {
    const all: any[] = [];
    for (const room of data.content) {
      all.push(...this.extractUsersFromRoom(room));
    }
    return all;
  }

  /** Load chat rooms + upsert users */
  loadMyRooms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMyChatRooms),
      mergeMap(({ page, size }) =>
        this.chatService.getMyRooms(page, size).pipe(
          mergeMap((data) => {
            const users = this.extractUsersFromRooms(data);

            return [loadMyChatRoomsSuccess({ data }), ...users.map((u) => upsertUser({ user: u }))];
          }),
          catchError((err) =>
            of(
              loadMyChatRoomsFailure({
                error: err?.error?.message || 'Failed to load rooms',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Load single chat room by ID + upsert users */
  loadRoomById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadChatRoomById),
      mergeMap(({ chatId }) =>
        this.chatService.getById(chatId).pipe(
          mergeMap((data: ChatRoom) => {
            const users = this.extractUsersFromRoom(data);

            return [
              loadChatRoomByIdSuccess({ data }),
              ...users.map((u) => upsertUser({ user: u })),
            ];
          }),
          catchError((err) =>
            of(
              loadChatRoomByIdFailure({
                error: err?.error?.message || 'Failed to load room',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Create room + upsert members + upsert latest message user */
  createRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createChatRoom),
      exhaustMap(({ payload }) =>
        this.chatService.create(payload).pipe(
          mergeMap((data: ChatRoom) => {
            this.toast.success('Chat room created');

            const users = this.extractUsersFromRoom(data);

            return [createChatRoomSuccess({ data }), ...users.map((u) => upsertUser({ user: u }))];
          }),
          catchError((err) =>
            of(
              createChatRoomFailure({
                error: err?.error?.message || 'Failed to create room',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // /** Update room + upsert all users */
  /** Update room + refetch to get updated data */
  updateRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateChatRoom),
      switchMap(({ chatId, payload }) =>
        this.chatService.update(chatId, payload).pipe(
          mergeMap(() => {
            this.toast.success('Chat room updated');

            // Commented this dut to inconsistency in backend, reponse of update is just a success message not the updated room
            // const users = this.extractUsersFromRoom(data);

            // return [updateChatRoomSuccess({ data }), ...users.map((u) => upsertUser({ user: u }))];

            // For now [quick fix]: Just return this single action
            return [loadChatRoomById({ chatId })];
          }),
          catchError((err) =>
            of(
              updateChatRoomFailure({
                error: err?.error?.message || 'Failed to update room',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  /** Delete room */
  deleteRoom$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteChatRoom),
      exhaustMap(({ chatId }) =>
        this.chatService.delete(chatId).pipe(
          map(() => {
            this.toast.success('Chat room deleted');
            return deleteChatRoomSuccess({ chatId });
          }),
          catchError((err) =>
            of(
              deleteChatRoomFailure({
                error: err?.error?.message || 'Failed to delete room',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
