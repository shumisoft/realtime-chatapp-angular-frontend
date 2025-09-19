import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { MessageService } from '../../services/message/message.service';
import * as MessageActions from './message.actions';
import { selectChatMeta } from './message.selectors';

@Injectable()
export class MessageEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(MessageService);
  private readonly store = inject(Store);

  //
  // LOAD INITIAL PAGE (page = 0)
  //
  loadInitial$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.loadInitialMessages),
      mergeMap(({ chatId }) =>
        this.service.getMessages(chatId, 0, 20).pipe(
          map((res) =>
            MessageActions.loadInitialMessagesSuccess({
              chatId,
              messages: res.content,
              hasMore: !res.last,
            }),
          ),
          catchError((err) => of(MessageActions.loadInitialMessagesFailure({ error: err }))),
        ),
      ),
    ),
  );

  //
  // LOAD OLDER MESSAGES (LAZY LOAD)
  //
  loadOlder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.loadOlderMessages),
      withLatestFrom(this.store.select(selectChatMeta)),
      mergeMap(([{ chatId }, metaMap]) => {
        const meta = metaMap[chatId];
        if (!meta?.hasMore) {
          return of(
            MessageActions.loadOlderMessagesSuccess({ chatId, messages: [], hasMore: false }),
          );
        }

        return this.service.getMessages(chatId, meta.page, 20).pipe(
          map((res) =>
            MessageActions.loadOlderMessagesSuccess({
              chatId,
              messages: res.content,
              hasMore: !res.last,
            }),
          ),
          catchError((err) => of(MessageActions.loadOlderMessagesFailure({ error: err }))),
        );
      }),
    ),
  );

  //
  // CREATE MESSAGE
  //
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.createMessage),
      mergeMap(({ chatId, dto }) =>
        this.service.create(chatId, dto).pipe(
          map((message) => MessageActions.createMessageSuccess({ message })),
          catchError((err) => of(MessageActions.createMessageFailure({ error: err }))),
        ),
      ),
    ),
  );

  //
  // UPDATE STATUS
  //
  updateStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageActions.updateMessage),
      mergeMap(({ message }) => {
        return this.service.updateMessage(message).pipe(
          map((message) => MessageActions.updateMessageSuccess({ message })),
          catchError((err) => of(MessageActions.updateMessageFailure({ error: err }))),
        );
      }),
    ),
  );
}
