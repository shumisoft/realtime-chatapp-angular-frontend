import { Component, inject, Input, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { ChatRoom, ChatRoomType } from '../../../../core/models/message.model';
import { Store } from '@ngrx/store';
import { selectChatRoom } from '../../../../core/store/chat-room/chat-room.actions';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { CommonModule } from '@angular/common';
import { UserState } from '../../../../core/models/user.models';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';

@Component({
  selector: 'app-chat-room-card',
  templateUrl: './chat-room-card.component.html',
  styleUrls: ['./chat-room-card.component.css'],
  imports: [CommonModule, AvatarComponent],
})
export class ChatRoomCardComponent implements OnInit {
  private readonly store = inject(Store);
  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  @Input() chatroom!: ChatRoom;
  constructor() {}

  ngOnInit() {}

  openChat() {
    this.store.dispatch(selectChatRoom({ chatId: this.chatroom.chatId }));
  }
  roomName(chatRoom: ChatRoom | null, principaluser: UserState | null) {
    let isDirectMessage = chatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
    return isDirectMessage
      ? chatRoom?.members
          .map((member) => member.user)
          .find((user) => user.userId != principaluser?.userId)?.fullName
      : chatRoom?.name;
  }
}
