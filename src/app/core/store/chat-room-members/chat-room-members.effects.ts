import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HotToastService } from '@ngxpert/hot-toast';
import { catchError, mergeMap, of } from 'rxjs';
import { ChatMembersService } from '../../services/chat-members/chat-members.service';
import { loadChatRoomById } from '../chat-room/chat-room.actions';
import { upsertUser } from '../users/users.actions';
import {
  addMember,
  addMemberSuccess,
  loadMembers,
  loadMembersFailure,
  loadMembersSuccess,
  removeMember,
  removeMemberSuccess,
} from './chat-room-members.actions';

@Injectable()
export class ChatMembersEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(ChatMembersService);
  private readonly toast = inject(HotToastService);

  /** Load all members for a chat room */
  loadMembers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMembers),
      mergeMap(({ chatId }) =>
        this.service.getMembers(chatId).pipe(
          mergeMap((members) => [
            loadMembersSuccess({ chatId, members }),

            // Update global user store for lookup + random color mapping
            ...members.map((m) =>
              upsertUser({
                user: m.user,
              }),
            ),
          ]),
          catchError((error) => of(loadMembersFailure({ chatId, error }))),
        ),
      ),
    ),
  );

  /** Add Member */
  addMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addMember),
      mergeMap(({ chatId, userId }) => {
        this.toast.loading('Adding member...', { id: 'add-member' });

        return this.service.addMember(chatId, { userId }).pipe(
          mergeMap(() => {
            this.toast.close('add-member');
            this.toast.success('Member added!');

            return [addMemberSuccess({ chatId }), loadChatRoomById({ chatId })];
          }),
          catchError((error) => {
            this.toast.close('add-member');
            this.toast.error(error?.error?.message || 'Failed to add member');

            return of(loadMembersFailure({ chatId, error }));
          }),
        );
      }),
    ),
  );

  /** Remove Member */
  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMember),
      mergeMap(({ chatId, userId }) =>
        this.service.removeMember(chatId, userId).pipe(
          mergeMap(() => {
            // map(() => removeMemberSuccess({ chatId, userId })),
            this.toast.success('Member removed!'); // ← NEW
            return [
              removeMemberSuccess({ chatId, userId }),
              loadChatRoomById({ chatId }), // ← Refetch room to get updated members
            ];
          }),
          catchError((error) => {
            this.toast.error('Failed to remove member'); // ← NEW
            return of(loadMembersFailure({ chatId, error }));
          }),
        ),
      ),
    ),
  );
}
