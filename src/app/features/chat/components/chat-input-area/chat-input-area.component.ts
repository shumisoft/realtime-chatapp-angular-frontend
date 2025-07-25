import { Component, inject, Input, OnInit } from '@angular/core';
import { MessageService } from '../../../../core/services/message/message.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { createMessage } from '../../../../core/store/message/message.actions';
import { ChatRoom, Message } from '../../../../core/models/message.model';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { Subject, switchMap, tap, throttleTime } from 'rxjs';
import { User, UserState } from '../../../../core/models/user.models';

@Component({
  selector: 'app-chat-input-area',
  templateUrl: './chat-input-area.component.html',
  styleUrls: ['./chat-input-area.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatInputAreaComponent implements OnInit {
  @Input() principalUser!: UserState | null;

  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  selectedchatroom!: ChatRoom;
  message = '';

  private typingSubject = new Subject<string>();

  constructor() {
    this.typingSubject.pipe(throttleTime(2000)).subscribe((typing) => {
      console.log('typing...');
      if (this.principalUser?.userId)
        this.messageService.sendTypingEvent({
          chatId: +this.selectedchatroom.chatId,
          userId: this.principalUser?.userId,
          typing: true,
        });
    });
  }

  onTyping(value: string) {
    this.typingSubject.next(value);
  }

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
