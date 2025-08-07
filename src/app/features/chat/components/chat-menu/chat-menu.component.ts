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
import { ChatRoomUtil } from '../../../../core/utils/chat-room.util';

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
  readonly util = ChatRoomUtil;

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  private currentChatRoom: ChatRoom | null = null;
  private currentPrincipalUser: UserState | null = null;

  isDirectMessage!: boolean;

  typingText$!: Observable<string | null>;

  constructor() {
    combineLatest([this.selectedChatRoom$, this.principalUser$])
      .pipe(
        map(([room, principalUser]) => {
          if (!room || !principalUser?.userId) return;

          this.currentChatRoom = room;
          this.isDirectMessage = this.util.isDirectMessage(room);

          this.currentPrincipalUser = principalUser;

          this.typingText$ = this.store.select(
            selectTypingDisplayText(room.chatId, principalUser.userId),
          );

          // Find the "Other" principalUser in a DM
          const otherUser = this.util.getOtherUser(room, principalUser);

          return { room, principalUser, isDirectMessage: this.isDirectMessage, otherUser };
        }),
        switchMap((data) => {
          if (!data) return of(null);

          const { isDirectMessage, otherUser } = data;
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
    return this.util.isDirectMessage(chatRoom)
      ? this.displayUserStatusText
      : this.formatUserList(chatRoom?.members.map((member) => member.user.fullName));
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
    if (this.util.isDirectMessage(chatRoom)) {
      const otherUser = this.util.getOtherUser(chatRoom, principalUser);

      if (otherUser?.username) {
        this.router.navigate(['/user', otherUser.username]);
      }
      return;
    }

    // For Groups [PUBLIC, PRIVATE]
    this.router.navigate(['/group', chatRoom.chatId]);
  }
}
