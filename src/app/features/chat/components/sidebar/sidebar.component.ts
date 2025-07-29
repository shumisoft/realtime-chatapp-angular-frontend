import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { Message } from '../../../../core/models/message.model';
import { MessageEventCommunicator } from '../../../../core/services/message-event-communicator/message-event-communicator';
import { MessageService } from '../../../../core/services/message/message.service';
import { logout } from '../../../../core/store/auth/auth.actions';
import {
  loadMyChatRooms
} from '../../../../core/store/chat-room/chat-room.actions';
import {
  selectChatRoomLoading,
  selectChatRoomsSorted,
  selectHasMoreChatRooms,
  selectSelectedChatRoom,
} from '../../../../core/store/chat-room/chat-room.selectors';
import { incomingWsMessage } from '../../../../core/store/message/message.actions';
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
export class SidebarComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);
  private readonly messageEventCommunicator = inject(MessageEventCommunicator);

  sendData(message: Message) {
    this.messageEventCommunicator.emitEvent(message);
  }

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  rooms$ = this.store.select(selectChatRoomsSorted);
  loading$ = this.store.select(selectChatRoomLoading);
  hasMore$ = this.store.select(selectHasMoreChatRooms);

  showLogoutModal = false;
  logoutLoader = false;

  constructor() {
    this.rooms$
      .pipe(
        switchMap((rooms) => {
          if (!rooms || rooms.length === 0) {
            this.store.dispatch(loadMyChatRooms({ page: 0, size: 20 }));
          } else {
            for (let room of rooms) {
              this.messageService.listenToChat(room.chatId).subscribe((msg) => {
                this.store.dispatch(incomingWsMessage({ message: msg }));
                this.sendData(msg);
              });
            }
          }

          return rooms;
        }),
      )
      .subscribe();
  }

  ngOnInit() {}

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
