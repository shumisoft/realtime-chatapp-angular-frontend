import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { ChatRoom, ChatRoomType } from '../../../../core/models/message.model';
import { UserState } from '../../../../core/models/user.models';
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

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  private currentChatRoom: ChatRoom | null = null;
  private currentPrincipalUser: UserState | null = null;

  isDirectMessage!: boolean;

  typingText$!: Observable<string | null>;

  constructor() {
    combineLatest([this.selectedChatRoom$, this.principalUser$]).subscribe(([room, user]) => {
      if (!room || !user?.userId) return;

      this.currentChatRoom = room;
      this.isDirectMessage = room.type === ChatRoomType.DIRECT_MESSAGE;

      this.currentPrincipalUser = user;

      this.typingText$ = this.store.select(selectTypingDisplayText(room.chatId, user.userId));
    });
  }

  ngOnInit() {}

  roomSubtitle(chatRoom: ChatRoom | null) {
    let isDirectMessage = chatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
    return isDirectMessage
      ? 'Last Seen: WIP'
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
