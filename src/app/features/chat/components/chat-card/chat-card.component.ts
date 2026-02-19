import { MessageType } from './../../../../core/models/message.model';
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
import {
  ChatRoom,
  ChatRoomType,
  Message,
  MessageStatus,
} from '../../../../core/models/message.model';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { selectUserById, selectUserColor } from '../../../../core/store/users/users.selectors';
import { Check, DoneAll, Schedule } from '../../../../shared/components/icons';

@Component({
  selector: 'app-chat-card',
  standalone: true,
  imports: [CommonModule, Check, DoneAll, Schedule],
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
    if (this.isDirectMessageRoom() && this.message.status !== MessageStatus.READ) {
      this.observer = new IntersectionObserver(() => {
        this.onRead.emit(true);
      });

      this.observer.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
