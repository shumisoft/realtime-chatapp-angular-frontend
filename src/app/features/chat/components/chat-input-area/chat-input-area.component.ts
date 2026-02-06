import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services/message/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { createMessage } from '../../../../core/store/message/message.actions';
import { ChatRoom, Message } from '../../../../core/models/chat-room.model';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-chat-input-area',
  templateUrl: './chat-input-area.component.html',
  styleUrls: ['./chat-input-area.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatInputAreaComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  selectedchatroom!: ChatRoom;
  message = '';

  constructor() {}

  ngOnInit() {
    this.selectedChatRoom$
      .pipe(
        tap((chatroom) => {
          if (chatroom) this.selectedchatroom = chatroom;
        }),
      )
      .subscribe();
  }

  onSend(): void {
    const trimmedContent = this.message.trim();
    if (!trimmedContent) return;

    // this.store.dispatch(
    //   createMessage({
    //     chatId: this.selectedchatroom?.chatId,
    //     dto: { content: this.message },
    //   }),
    // );

    this.messageService.sendMessage({
      chatRoomId: this.selectedchatroom?.chatId,
      content: trimmedContent,
    });

    this.message = '';
  }
}
