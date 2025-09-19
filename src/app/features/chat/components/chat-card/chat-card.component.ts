import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import {
  ChatRoom,
  ChatRoomType,
  Message,
  MessageStatus,
} from '../../../../core/models/message.model';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { selectUserById, selectUserColor } from '../../../../core/store/users/users.selectors';
import { Check, DoneAll, Schedule } from '../../../../shared/components/icons';
import { ImageViewerModal } from '../../../../shared/components/image-viewer-modal/image-viewer-modal';
import { MessageType } from './../../../../core/models/message.model';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule, Check, DoneAll, Schedule, ImageViewerModal],
  templateUrl: './chat-card.component.html',
  styleUrl: './chat-card.component.css',
})
export class ChatCardComponent implements AfterViewInit, OnDestroy {
  @Input() message!: Message;
  @Input() selectedChatRoom!: ChatRoom | null;

  @Output() onRead = new EventEmitter<boolean>();

  private readonly el = inject(ElementRef);
  private observer!: IntersectionObserver;

  private readonly store = inject(Store);
  readonly principalUser$ = this.store.select(selectPrincipleUser);
  readonly userCache$ = this.store.select(selectUserById);

  readonly messageStatus = MessageStatus;
  isViewerOpen = false;
  imagePreviewUrl: string | null = null;

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

  isDirectMessageRoom(): boolean {
    return this.selectedChatRoom?.type === ChatRoomType.DIRECT_MESSAGE;
  }

  isImage(): boolean {
    return this.message.type === MessageType.IMAGE;
  }

  ngAfterViewInit() {
    this.principalUser$.pipe(take(1)).subscribe((principalUser) => {
      const isUnread = this.message.status !== MessageStatus.READ;
      const isMyMessage = this.message.userId === principalUser.userId;

      // Only recipients should mark messages as read
      if (this.isDirectMessageRoom() && !isMyMessage && isUnread) {
        this.observer = new IntersectionObserver(() => {
          this.onRead.emit(true);
        });

        this.observer.observe(this.el.nativeElement);
      }
    });
  }

  openViewer(imageUrl: string) {
    this.imagePreviewUrl = imageUrl;
    this.isViewerOpen = true;
  }

  closeViewer() {
    this.imagePreviewUrl = null;
    this.isViewerOpen = false;
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
