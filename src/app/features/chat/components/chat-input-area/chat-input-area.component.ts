import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { ChatRoom, TypingEventDTO } from '../../../../core/models/message.model';
import { UserState } from '../../../../core/models/user.models';
import { MessageService } from '../../../../core/services/message/message.service';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { AttachFile, Send } from '../../../../shared/components/icons';

@Component({
  selector: 'app-chat-input-area',
  templateUrl: './chat-input-area.component.html',
  styleUrls: ['./chat-input-area.component.css'],
  imports: [CommonModule, FormsModule, AttachFile, Send],
})
export class ChatInputAreaComponent implements OnInit, OnDestroy {
  @Input() principalUser!: UserState | null;

  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  selectedchatroom!: ChatRoom;
  message = '';

  private readonly TYPING_IDLE_MS = 2000;

  private typingActivity$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  private isTyping = false;

  ngOnInit() {
    // When chat changes → reset typing
    this.selectedChatRoom$
      .pipe(
        tap((chatroom) => {
          if (chatroom) {
            this.selectedchatroom = chatroom;
            this.stopTyping();
          }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();

    // Idle detection
    this.typingActivity$
      .pipe(debounceTime(this.TYPING_IDLE_MS), takeUntil(this.destroy$))
      .subscribe(() => {
        this.stopTyping();
      });
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

    // IMPORTANT → stop typing when sending
    this.stopTyping();
    this.message = '';
  }

  onTyping(value: string) {
    if (!this.selectedchatroom) return;
    if (!this.principalUser?.userId) return;

    // Empty input → stop typing immediately
    if (!value.trim()) {
      console.info('[ChatInputAreaComponent - Event miss] empty input...');
      this.stopTyping();
      return;
    }

    // First keystroke
    if (!this.isTyping) {
      this.sendTypingEvent(true);
      this.isTyping = true;
    }

    // Emit activity signal (resets debounce timer)
    this.typingActivity$.next();
  }

  private sendTypingEvent(typing: boolean) {
    if (!this.principalUser?.userId || !this.selectedchatroom) return;

    const dto: TypingEventDTO = {
      chatId: this.selectedchatroom.chatId,
      userId: this.principalUser.userId,
      typing,
    };

    this.messageService.sendTypingEvent(dto);
  }

  private stopTyping() {
    if (!this.isTyping) return;

    this.sendTypingEvent(false);
    this.isTyping = false;
  }

  ngOnDestroy() {
    this.stopTyping();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
