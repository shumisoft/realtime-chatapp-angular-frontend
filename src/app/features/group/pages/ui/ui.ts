import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, switchMap, take, tap } from 'rxjs';
import { ChatRoom } from '../../../../core/models/message.model';
import {
  loadChatRoomById,
  updateChatRoom,
} from '../../../../core/store/chat-room/chat-room.actions';
import {
  selectChatRoomById,
  selectChatRoomLoading,
} from '../../../../core/store/chat-room/chat-room.selectors';
import { getPrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { GroupCard } from '../../components/group-card/group-card';
import { removeMember } from '../../../../core/store/chat-room-members/chat-room-members.actions';

@Component({
  standalone: true,
  selector: 'app-ui',
  imports: [CommonModule, GroupCard],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  readonly principalUser$ = this.store.select(selectPrincipleUser);
  readonly loading$ = this.store.select(selectChatRoomLoading);

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((chatId) =>
      combineLatest([
        this.store.select(selectChatRoomById(chatId)),
        this.principalUser$,
        this.loading$,
      ]).pipe(
        tap(([room, , loading]) => {
          // Load only if not already in store and not currently loading
          if (!room && !loading) {
            this.store.dispatch(loadChatRoomById({ chatId }));
          }
        }),
        map(([group, principalUser, loading]) => {
          const sortedGroup = group
            ? {
                ...group,
                members: [...(group.members || [])].sort((a, b) => (a.admin ? -1 : 1)),
              }
            : null;

          return {
            group: sortedGroup,
            loading,
            principalUserId: principalUser?.userId ?? null,
            isGroupAdmin: !!sortedGroup?.members.find(
              (m) => m.userId === principalUser?.userId && m.admin,
            ),
          };
        }),
      ),
    ),
  );
  ngOnInit(): void {
    // Ensure principal user is loaded
    this.principalUser$.pipe(take(1)).subscribe((user) => {
      if (!user?.userId) {
        this.store.dispatch(getPrincipalUser());
      }
    });
  }

  onUpdateGroup(payload: Partial<Pick<ChatRoom, 'name' | 'description'>>) {
    console.log('[onUpdateGroup] recieved update group event!');

    // Get current chatId from route
    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        filter((chatId) => !!chatId),
      )
      .subscribe((chatId) => {
        console.log('[onUpdateGroup] recieved update group event!', chatId);

        this.store.dispatch(
          updateChatRoom({
            chatId,
            payload,
          }),
        );
      });
  }

  onRemoveMember(userId: string) {
    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        filter((chatId) => !!chatId),
      )
      .subscribe((chatId) => {
        console.log('event revieved to remove member with Id: ', { userId, chatId });
        this.store.dispatch(
          removeMember({
            chatId,
            userId,
          }),
        );
      });
  }

  // Optional: Clear selection when leaving
  // ngOnDestroy(): void {
  //   this.store.dispatch(selectChatRoom({ chatId: null }));
  // }
}
