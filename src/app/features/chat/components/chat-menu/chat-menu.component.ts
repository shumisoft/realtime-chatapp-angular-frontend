import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, of, Subscription, switchMap, timer } from 'rxjs';
import { ChatRoom, ChatRoomType } from '../../../../core/models/message.model';
import { OnlineStatusType, UserStatus } from '../../../../core/models/user-status.model';
import { UserState } from '../../../../core/models/user.models';
import { UserStatusService } from '../../../../core/services/user-status/user-status.service';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { selectTypingDisplayText } from '../../../../core/store/presence/presence.selectors';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.css'],
  imports: [AvatarComponent, CommonModule],
})
export class ChatMenuComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  private readonly userStatusService = inject(UserStatusService);
  private userStatus?: UserStatus | null;
  private userStatusSubcription?: Subscription;

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  private currentChatRoom: ChatRoom | null = null;
  private currentPrincipalUser: UserState | null = null;

  isDirectMessage!: boolean;

  typingText$!: Observable<string | null>;

  constructor() {
    combineLatest([this.selectedChatRoom$, this.principalUser$])
      .pipe(
        map(([room, user]) => {
          if (!room || !user?.userId) return;

          this.currentChatRoom = room;
          this.isDirectMessage = room.type === ChatRoomType.DIRECT_MESSAGE;

          this.currentPrincipalUser = user;

          this.typingText$ = this.store.select(selectTypingDisplayText(room.chatId, user.userId));

          // Find the "Other" user in a DM
          const otherUser = this.isDirectMessage
            ? room.members.find((m) => m.user.userId !== user.userId)?.user
            : null;

          return { room, user, isDirectMessage: this.isDirectMessage, otherUser };
        }),
        switchMap((data) => {
          if (!data) return of(null);

          const { room, user, isDirectMessage, otherUser } = data;
          this.userStatusSubcription?.unsubscribe();
          if (!isDirectMessage || !otherUser) {
            return of(null);
          }

          return timer(0, 20000).pipe(
            switchMap(() => this.userStatusService.getUserStatuses([otherUser.userId])),
            map((response) => (otherUser.userId ? response[otherUser.userId] || null : null)),
          );
        }),
      )
      .subscribe((status) => {
        console.log(status);

        this.userStatus = status;
      });
  }

  ngOnInit() {}

  get isUserOnline(): boolean {
    return this.userStatus?.status === OnlineStatusType.ONLINE;
  }

  get displayUserStatusText(): string {
    if (!this.userStatus) return 'Offline';

    if (this.isUserOnline) return 'Online';

    // Use the service helper we made earlier
    return this.userStatusService.getDisplayStatus(this.userStatus);
  }

  roomSubtitle(chatRoom: ChatRoom | null) {
    let isDirectMessage = chatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
    return isDirectMessage
      ? this.displayUserStatusText
      : this.formatUserList(chatRoom?.members.map((member) => member.user.fullName));
  }

  roomName(chatRoom: ChatRoom | null, principaluser: UserState | null) {
    let isDirectMessage = chatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
    return isDirectMessage
      ? chatRoom?.members
          .map((member) => member.user)
          .find((user) => user.userId != principaluser?.userId)?.fullName
      : chatRoom?.name;
  }

  formatUserList(usernames: (string | null)[] | undefined) {
    if (!usernames) return;
    return usernames.length > 3
      ? `${usernames.slice(0, 3).join(', ')} (+${usernames.length - 3} more)`
      : usernames.join(', ');
  }

  onChatMenuClick() {
    const chatRoom = this.currentChatRoom;
    const principalUser = this.currentPrincipalUser;

    if (!chatRoom) return;

    // For DM
    const isDirectMessage = chatRoom.type === ChatRoomType.DIRECT_MESSAGE;

    if (isDirectMessage) {
      const otherUser = chatRoom.members
        .map((m) => m.user)
        .find((u) => u.userId !== principalUser?.userId);

      if (otherUser?.username) {
        this.router.navigate(['/user', otherUser.username]);
      }
      return;
    }

    // For Groups [PUBLIC, PRIVATE]
    this.router.navigate(['/group', chatRoom.chatId]);
  }
}
