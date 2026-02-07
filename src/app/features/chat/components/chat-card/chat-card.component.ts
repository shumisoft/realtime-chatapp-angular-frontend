import { ChatRoomType } from './../../../../core/models/chat-room.model';
import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Message } from '../../../../core/models/chat-room.model';
import { Store } from '@ngrx/store';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';

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

  formattedTime(timestamp: string): string {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour12: false });
  }

  isDirectMessageRoom(type: ChatRoomType | undefined): boolean {
    return type === ChatRoomType.DIRECT_MESSAGE;
  }
}
