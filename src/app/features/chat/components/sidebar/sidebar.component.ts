import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { ChatRoomCardComponent } from '../chat-room-card/chat-room-card.component';
import { Store } from '@ngrx/store';
import { loadMyChatRooms } from '../../../../core/store/chat-room/chat-room.actions';
import {
  selectChatRoomLoading,
  selectChatRoomsSorted,
  selectHasMoreChatRooms,
} from '../../../../core/store/chat-room/chat-room.selectors';
import { switchMap } from 'rxjs';
import { MessageService } from '../../../../core/services/message/message.service';
import { incomingWsMessage } from '../../../../core/store/message/message.actions';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, SidebarMenuComponent, ChatRoomCardComponent],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);

  rooms$ = this.store.select(selectChatRoomsSorted);
  loading$ = this.store.select(selectChatRoomLoading);
  hasMore$ = this.store.select(selectHasMoreChatRooms);

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
              });
            }
          }

          return rooms;
        }),
      )
      .subscribe();
  }

  ngOnInit() {}
}
