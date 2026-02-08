import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ChatMembersService } from '../../services/chat-members/chat-members.service';
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
      mergeMap(({ chatId, member }) =>
        this.service.addMember(chatId, member).pipe(
          map(() => addMemberSuccess({ chatId })),
          catchError((error) => of(loadMembersFailure({ chatId, error }))),
        ),
      ),
    ),
  );

  /** Remove Member */
  removeMember$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeMember),
      mergeMap(({ chatId, userId }) =>
        this.service.removeMember(chatId, userId).pipe(
          map(() => removeMemberSuccess({ chatId, userId })),
          catchError((error) => of(loadMembersFailure({ chatId, error }))),
        ),
      ),
    ),
  );
}
