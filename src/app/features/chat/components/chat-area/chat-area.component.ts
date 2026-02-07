import {
  Component,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { ChatCardComponent } from '../chat-card/chat-card.component';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { ChatRoom, Message } from '../../../../core/models/chat-room.model';
import { loadInitialMessages } from '../../../../core/store/message/message.actions';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import {
  selectChatHasMore,
  selectMessageLoading,
  selectMessagesByChatId,
} from '../../../../core/store/message/message.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
  imports: [CommonModule, ChatCardComponent],
})
export class ChatAreaComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private readonly store = inject(Store);
  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  messages$!: Observable<Message[]>;
  hasMore$!: Observable<boolean>;
  loading$!: Observable<boolean>;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  constructor() {
    this.selectedChatRoom$
      .pipe(
        tap((chatRoom) => {
          if (chatRoom) {
            this.store.dispatch(loadInitialMessages({ chatId: chatRoom.chatId }));
            this.messages$ = this.store
              .select(selectMessagesByChatId(chatRoom.chatId))
              .pipe(
                map((messages) =>
                  [...messages].sort(
                    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
                  ),
                ),
              );
            this.hasMore$ = this.store.select(selectChatHasMore(chatRoom.chatId));
            this.loading$ = this.store.select(selectMessageLoading);
          }
        }),
      )
      .subscribe();
  }

  ngOnInit() {}
}
