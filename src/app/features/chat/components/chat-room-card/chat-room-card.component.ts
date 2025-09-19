import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { ChatRoom, MessageType } from '../../../../core/models/message.model';
import { selectChatRoom } from '../../../../core/store/chat-room/chat-room.actions';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { selectTypingDisplayText } from '../../../../core/store/presence/presence.selectors';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { ChatRoomUtil } from '../../../../core/utils/chat-room.util';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

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
  readonly util = ChatRoomUtil;

  @Input() chatroom!: ChatRoom;
  constructor() {}

  showTyping$!: Observable<string | null>;

  ngOnInit() {
    combineLatest([this.principalUser$, this.selectedChatRoom$]).subscribe(
      ([principal, selectedRoom]) => {
        if (!principal?.userId) return;

        const typing$ = this.store.select(
          selectTypingDisplayText(this.chatroom.chatId, principal.userId),
        );

        this.showTyping$ = combineLatest([typing$]).pipe(
          map(([typing]) => {
            if (!typing) return null;

            // hide typing if this room is selected
            if (selectedRoom?.chatId === this.chatroom.chatId) return null;

            return typing;
          }),
        );
      },
    );
  }

  isLatestMessageImage() {
    return this.chatroom.latestMessage?.type === MessageType.IMAGE;
  }

  openChat() {
    this.store.dispatch(selectChatRoom({ chatId: this.chatroom.chatId }));
  }
}
