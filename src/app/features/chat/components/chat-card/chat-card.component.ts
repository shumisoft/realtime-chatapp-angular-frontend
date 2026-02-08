import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChatRoomType, Message } from '../../../../core/models/message.model';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { selectUserById, selectUserColor } from '../../../../core/store/users/users.selectors';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css',
})
export class ChatCardComponent {
  @Input() message!: Message;

  private readonly store = inject(Store);
  readonly principalUser$ = this.store.select(selectPrincipleUser);
  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly userCache$ = this.store.select(selectUserById);

  formattedTime(timestamp: string): string {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour12: false });
  }

  selectUserById$(userId: string) {
    return this.store.select(selectUserById(userId));
  }

  selectUserColorById$(userId: string) {
    return this.store.select(selectUserColor(userId));
  }

  isDirectMessageRoom(type: ChatRoomType | undefined): boolean {
    return type === ChatRoomType.DIRECT_MESSAGE;
  }
}
