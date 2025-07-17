import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, map, Observable, take, tap } from 'rxjs';
import { Message } from '../../../../core/models/message.model';
import { MessageEventCommunicator } from '../../../../core/services/message-event-communicator/message-event-communicator';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import {
  loadInitialMessages,
  loadOlderMessages,
} from '../../../../core/store/message/message.actions';
import {
  selectChatHasMore,
  selectMessageLoading,
  selectMessagesByChatId,
} from '../../../../core/store/message/message.selectors';
import { ChatCardComponent } from '../chat-card/chat-card.component';

enum ScrollState {
  NONE,
  INITIAL_BOTTOM,
  WS_BOTTOM,
  RESTORE_TOP,
  SCROLL_BOTTOM_ON_CHAT_CHANGE,
}

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
  imports: [CommonModule, ChatCardComponent],
})
export class ChatAreaComponent implements OnInit, AfterViewInit {
  private readonly store = inject(Store);
  private readonly messageEventCommunicator = inject(MessageEventCommunicator);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  selectedChatRoomId!: number;

  messages$!: Observable<Message[]>;
  hasMore$!: Observable<boolean>;
  loading$!: Observable<boolean>;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('topSentinel') topSentinel!: ElementRef;

  private prevScrollHeight = 0;
  private scrollState: ScrollState = ScrollState.NONE;
  private userReadingHistory = false;

  constructor() {}

  ngOnInit() {
    this.selectedChatRoom$
      .pipe(
        tap((chatRoom) => {
          if (!chatRoom) return;

          this.selectedChatRoomId = chatRoom.chatId;

          // Whenever chat changes -> always scroll to bottom
          this.scrollState = ScrollState.SCROLL_BOTTOM_ON_CHAT_CHANGE;

          this.store
            .select(selectMessagesByChatId(chatRoom.chatId))
            .pipe(take(1))
            .subscribe((list) => {
              if (list.length === 0 && !list[0]?.messageId) {
                this.scrollState = ScrollState.INITIAL_BOTTOM;
                this.store.dispatch(loadInitialMessages({ chatId: chatRoom.chatId }));
              }
            });

          this.messages$ = this.store.select(selectMessagesByChatId(chatRoom.chatId)).pipe(
            map((messages) =>
              [...messages].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
              ),
            ),
            distinctUntilChanged((a, b) => a.length === b.length),
            tap((messages) => this.onMessagesChanged(messages)),
          );

          this.hasMore$ = this.store.select(selectChatHasMore(chatRoom.chatId));
          this.loading$ = this.store.select(selectMessageLoading);
        }),
      )
      .subscribe();
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (this.scrollState !== ScrollState.INITIAL_BOTTOM) {
          this.triggerLazyLoad();
        }
      }
    });

    observer.observe(this.topSentinel.nativeElement);

    this.selectedChatRoom$
      .pipe(
        tap((chatRoom) => {
          if (!chatRoom) return;

          this.selectedChatRoomId = chatRoom.chatId;

          this.messageEventCommunicator.event$.subscribe((data) => {
            if (this.selectedChatRoomId === data.chatRoomId) {
              this.userReadingHistory = false;
              this.scrollToBottom();
            }
          });

          // Whenever chat changes -> always scroll to bottom
          this.scrollState = ScrollState.SCROLL_BOTTOM_ON_CHAT_CHANGE;

          this.store
            .select(selectMessagesByChatId(chatRoom.chatId))
            .pipe(take(1))
            .subscribe((list) => {
              if (list.length === 0 && !list[0]?.messageId) {
                this.scrollState = ScrollState.INITIAL_BOTTOM;
                this.store.dispatch(loadInitialMessages({ chatId: chatRoom.chatId }));
              }
            });

          this.messages$ = this.store.select(selectMessagesByChatId(chatRoom.chatId)).pipe(
            map((messages) =>
              [...messages].sort(
                (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
              ),
            ),
            distinctUntilChanged((a, b) => a.length === b.length),
            tap((messages) => this.onMessagesChanged(messages)),
          );

          this.hasMore$ = this.store.select(selectChatHasMore(chatRoom.chatId));
          this.loading$ = this.store.select(selectMessageLoading);
        }),
      )
      .subscribe();
  }

  // ------------------------------------------
  // MESSAGE CHANGE HANDLER
  // ------------------------------------------

  private onMessagesChanged(messages: Message[]) {
    if (!messages || messages.length === 0) return;

    const el = this.scrollContainer.nativeElement;

    switch (this.scrollState) {
      case ScrollState.INITIAL_BOTTOM:
        this.scrollToBottomDeferred();
        break;

      case ScrollState.WS_BOTTOM:
        if (!this.userReadingHistory) this.scrollToBottomDeferred();
        break;

      case ScrollState.RESTORE_TOP:
        this.restoreScrollPosition();
        break;

      case ScrollState.SCROLL_BOTTOM_ON_CHAT_CHANGE:
        this.scrollToBottomDeferred();
        break;
    }

    this.scrollState = ScrollState.NONE;
  }

  private restoreScrollPosition() {
    const el = this.scrollContainer.nativeElement;

    requestAnimationFrame(() => {
      const newHeight = el.scrollHeight;
      const diff = newHeight - this.prevScrollHeight;

      el.scrollTop = diff;
    });
  }

  // ------------------------------------------
  // SCROLL HELPERS
  // ------------------------------------------

  private scrollToBottomDeferred() {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        this.scrollToBottom();
      }),
    );
  }

  private scrollToBottom() {
    try {
      const el = this.scrollContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  triggerLazyLoad() {
    const el = this.scrollContainer.nativeElement;
    this.prevScrollHeight = el.scrollHeight;
    this.scrollState = ScrollState.RESTORE_TOP;

    this.store.dispatch(loadOlderMessages({ chatId: this.selectedChatRoomId }));
  }

  onScroll(event: any) {
    const el = event.target;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.userReadingHistory = distFromBottom > 200;
  }

  handleIncomingWSMessage() {
    this.scrollState = ScrollState.WS_BOTTOM;
  }
}
