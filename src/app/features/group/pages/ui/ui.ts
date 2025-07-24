import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs';
import { ChatRoom } from '../../../../core/models/message.model';
import { User } from '../../../../core/models/user.models';
import {
  addMember,
  removeMember,
} from '../../../../core/store/chat-room-members/chat-room-members.actions';
import {
  deleteChatRoom,
  loadChatRoomById,
  updateChatRoom,
} from '../../../../core/store/chat-room/chat-room.actions';
import {
  selectChatRoomById,
  selectChatRoomLoadAttempted,
  selectChatRoomLoading,
} from '../../../../core/store/chat-room/chat-room.selectors';
import { getPrincipalUser } from '../../../../core/store/principal-user/principal-user.actions';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { AddMemberModal } from '../../components/add-member-modal/add-member-modal';
import { GroupCard } from '../../components/group-card/group-card';

@Component({
  standalone: true,
  selector: 'app-ui',
  imports: [CommonModule, GroupCard, AddMemberModal],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  readonly principalUser$ = this.store.select(selectPrincipleUser);
  readonly loading$ = this.store.select(selectChatRoomLoading);

  isAddMemberModalOpen = false;

  ngOnInit(): void {
    // Ensure principal user is loaded
    this.principalUser$.pipe(take(1)).subscribe((user) => {
      if (!user?.userId) {
        this.store.dispatch(getPrincipalUser());
      }
    });
  }

  readonly viewModel$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    distinctUntilChanged(),
    switchMap((chatId) =>
      combineLatest([
        this.store.select(selectChatRoomById(chatId)),
        this.store.select(selectChatRoomLoadAttempted(chatId)),
        this.principalUser$,
        this.loading$,
      ]).pipe(
        tap(([room, loadAttempted, , loading]) => {
          // Only load if: not in store, not loading, and haven't tried yet
          if (!room && !loading && !loadAttempted) {
            this.store.dispatch(loadChatRoomById({ chatId }));
          }
        }),
        map(([group, loadAttempted, principalUser, loading]) => {
          const sortedGroup = group
            ? {
                ...group,
                members: [...(group.members || [])].sort((a, b) => (a.admin ? -1 : 1)),
              }
            : null;

          return {
            group: sortedGroup,
            loading,
            loadAttempted,
            principalUserId: principalUser?.userId ?? null,
            isGroupAdmin: !!sortedGroup?.members.find(
              (m) => m.userId === principalUser?.userId && m.admin,
            ),
            existingMemberIds: sortedGroup?.members.map((m) => m.userId) ?? [],
          };
        }),
      ),
    ),
  );

  onUpdateGroup(payload: Partial<Pick<ChatRoom, 'name' | 'description'>>) {
    // Get current chatId from route
    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        filter((chatId) => !!chatId),
      )
      .subscribe((chatId) => {
        this.store.dispatch(updateChatRoom({ chatId, payload }));
      });
  }

  openAddMemberModal() {
    this.isAddMemberModalOpen = true;
  }

  closeAddMemberModal() {
    this.isAddMemberModalOpen = false;
  }

  onAddMember() {
    this.openAddMemberModal();
  }

  onUserSelected(user: User) {
    if (!user?.userId) return;

    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        filter((chatId) => !!chatId),
      )
      .subscribe((chatId) => {
        if (user?.userId) {
          this.store.dispatch(
            addMember({
              chatId,
              userId: user.userId,
            }),
          );
        }

        return;
      });

    this.closeAddMemberModal();
  }

  onRemoveMember(userId: string) {
    this.route.paramMap
      .pipe(
        take(1),
        map((params) => Number(params.get('id'))),
        filter((chatId) => !!chatId),
      )
      .subscribe((chatId) => {
        this.store.dispatch(
          removeMember({
            chatId,
            userId,
          }),
        );
      });
  }

  onDeleteGroup(chatId: number) {
    this.store.dispatch(deleteChatRoom({ chatId }));
  }

  // Optional: Clear selection when leaving
  // ngOnDestroy(): void {
  //   this.store.dispatch(selectChatRoom({ chatId: null }));
  // }
}
