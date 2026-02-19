import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, Subject, takeUntil, tap } from 'rxjs';
import { ChatRoom, MessageType, TypingEventDTO } from '../../../../core/models/message.model';
import { UserState } from '../../../../core/models/user.models';
import { MessageService } from '../../../../core/services/message/message.service';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { AttachFile, Send } from '../../../../shared/components/icons';
import { ImagePreview } from '../../../../shared/components/image-preview/image-preview';
import { ImageViewerModal } from '../../../../shared/components/image-viewer-modal/image-viewer-modal';
import { StorageService } from '../../../../core/services/storage/storage.service';

@Component({
  selector: 'app-chat-input-area',
  templateUrl: './chat-input-area.component.html',
  styleUrls: ['./chat-input-area.component.css'],
  imports: [CommonModule, FormsModule, AttachFile, Send, ImagePreview, ImageViewerModal],
})
export class ChatInputAreaComponent implements OnInit, OnDestroy {
  @Input() principalUser!: UserState | null;

  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);
  private readonly storageService = inject(StorageService);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  selectedchatroom!: ChatRoom;
  message = '';

  private readonly TYPING_IDLE_MS = 2000;

  private typingActivity$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  private isTyping = false;
  isUploading = false;

  selectedImageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  isViewerOpen = false;

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
    console.log('upload');

    const trimmedContent = this.message.trim();
    if (!trimmedContent && !this.selectedImageFile) return;
    console.log('upload');

    if (this.isUploading) return;
    console.log('upload');

    const chatId = this.selectedchatroom?.chatId;
    if (!chatId) return;

    console.log('upload');

    // SCENARIO 1: Image Upload (with or without text)
    if (this.selectedImageFile) {
      this.isUploading = true;

      this.storageService.uploadFile(this.selectedImageFile).subscribe({
        next: (imageUrl) => {
          // 1. Send the Image Message
          this.messageService.sendMessage({
            chatRoomId: chatId,
            content: imageUrl,
            type: MessageType.IMAGE,
          });

          // 2. If there was also text, send it as a separate message
          if (trimmedContent) {
            this.messageService.sendMessage({
              chatRoomId: chatId,
              content: trimmedContent,
            });
          }

          // 3. Cleanup
          this.resetInput();
        },
        error: (err) => {
          console.error('Upload Failed', err);
          this.isUploading = false;
          // Optionally show a toast notification here
        },
      });
    }
    // SCENARIO 2: Text Only
    else {
      this.messageService.sendMessage({
        chatRoomId: chatId,
        content: trimmedContent,
      });
      this.resetInput();
    }

    // IMPORTANT → stop typing when sending
    this.stopTyping();
    this.message = '';
  }

  // Helper to clean up state after sending
  private resetInput() {
    this.message = '';
    this.removeSelectedImage();
    this.stopTyping();
    this.isUploading = false;
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

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // 1️⃣ Validate image type
    if (!file.type.startsWith('image/')) {
      console.warn('Only image files allowed');
      return;
    }

    this.selectedImageFile = file;

    // 2️⃣ Generate preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be selected again later
    input.value = '';
  }

  removeSelectedImage() {
    this.selectedImageFile = null;
    this.imagePreviewUrl = null;
  }

  openViewer() {
    this.isViewerOpen = true;
    console.log('image clicked');
  }

  closeViewer() {
    this.isViewerOpen = false;
  }

  ngOnDestroy() {
    this.stopTyping();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
