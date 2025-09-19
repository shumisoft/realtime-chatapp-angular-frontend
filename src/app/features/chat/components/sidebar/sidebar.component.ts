import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subject, switchMap, take, takeUntil } from 'rxjs';
import { Message, MessageStatus } from '../../../../core/models/message.model';
import { MessageEventCommunicator } from '../../../../core/services/message-event-communicator/message-event-communicator';
import { MessageService } from '../../../../core/services/message/message.service';
import { logout } from '../../../../core/store/auth/auth.actions';
import { selectIsLoggedIn } from '../../../../core/store/auth/auth.selectors';
import {
  loadMyChatRooms,
  updateChatRoomLatestMessage,
} from '../../../../core/store/chat-room/chat-room.actions';
import {
  selectChatRoomLoading,
  selectChatRoomsSorted,
  selectHasMoreChatRooms,
  selectSelectedChatRoom,
} from '../../../../core/store/chat-room/chat-room.selectors';
import { incomingWsMessage, updateMessage } from '../../../../core/store/message/message.actions';
import { selectPrincipleUser } from '../../../../core/store/principal-user/principal-user.selectors';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';
import { ChatRoomCardComponent } from '../chat-room-card/chat-room-card.component';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, SidebarMenuComponent, ChatRoomCardComponent, ConfirmationDialog],
  standalone: true,
})
export class SidebarComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);
  private readonly messageEventCommunicator = inject(MessageEventCommunicator);
  private readonly destroy$ = new Subject<void>(); // ← ADD THIS

  sendData(message: Message) {
    this.messageEventCommunicator.emitEvent(message);
  }

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);
  readonly isLoggedIn$ = this.store.select(selectIsLoggedIn);
  readonly principalUser$ = this.store.select(selectPrincipleUser);

  rooms$ = this.store.select(selectChatRoomsSorted);
  loading$ = this.store.select(selectChatRoomLoading);
  hasMore$ = this.store.select(selectHasMoreChatRooms);

  showLogoutModal = false;
  logoutLoader = false;

  constructor() {
    // Combine rooms$ with isLoggedIn$ to prevent dispatch after logout
    combineLatest([this.rooms$, this.isLoggedIn$])
      .pipe(
        takeUntil(this.destroy$), // Unsubscribe on destroy
        switchMap(([rooms, isLoggedIn]) => {
          if (isLoggedIn && (!rooms || rooms.length === 0)) {
            // Only dispatch if logged in AND no rooms
            console.info('[Sidebar] Dispatching loadMyChatRooms');
            this.store.dispatch(loadMyChatRooms({ page: 0, size: 20 }));
          } else if (isLoggedIn && rooms.length > 0) {
            // Only listen to WebSocket if logged in
            console.info('[Sidebar] Setting up WebSocket listeners for', rooms.length, 'rooms');
            for (let room of rooms) {
              this.messageService
                .listenToChat(room.chatId)
                .pipe(takeUntil(this.destroy$)) // Unsubscribe these too on destroy
                .subscribe((msg) => {
                  this.store.dispatch(incomingWsMessage({ message: msg }));
                  this.store.dispatch(updateChatRoomLatestMessage({ message: msg }));
                  this.sendData(msg);

                  // Mark as 'DELIVERED' if it's not my own message and it's 'SENT'
                  this.principalUser$.pipe(take(1)).subscribe((principalUser) => {
                    if (msg.userId !== principalUser.userId && msg.status === MessageStatus.SENT) {
                      this.store.dispatch(
                        updateMessage({ message: { ...msg, status: MessageStatus.DELIVERED } }),
                      );
                    }
                  });
                });
            }
          }

          return rooms;
        }),
      )
      .subscribe();
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.info('[Sidebar] Component destroyed, cleaning up subscriptions');
    this.destroy$.next(); // Trigger unsubscription
    this.destroy$.complete(); // Complete the subject
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  onLogoutConfirmed(): void {
    this.store.dispatch(logout());
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  onLogout(): void {
    this.openLogoutModal();
  }
}
