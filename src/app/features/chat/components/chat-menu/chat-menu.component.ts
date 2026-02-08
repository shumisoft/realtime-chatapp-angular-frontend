import { Component, inject, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { Store } from '@ngrx/store';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { ChatRoom, ChatRoomType } from '../../../../core/models/message.model';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { User, UserState } from '../../../../core/models/user.models';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.css'],
  imports: [AvatarComponent, CommonModule],
})
export class ChatMenuComponent implements OnInit {
  private readonly store = inject(Store);
  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  isDirectMessage!: boolean;

  constructor() {
    this.selectedChatRoom$
      .pipe(
        tap((chatroom) => (this.isDirectMessage = chatroom?.type === ChatRoomType.DIRECT_MESSAGE)),
      )
      .subscribe();
  }

  ngOnInit() {}

  roomSubtitle(chatRoom: ChatRoom | null) {
    let isDirectMessage = chatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
    return isDirectMessage
      ? 'Last Seen: WIP'
      : this.formatUserList(chatRoom?.members.map((member) => member.user.username));
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
}
