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

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, SidebarMenuComponent, ChatRoomCardComponent],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  private readonly store = inject(Store);

  rooms$ = this.store.select(selectChatRoomsSorted);
  loading$ = this.store.select(selectChatRoomLoading);
  hasMore$ = this.store.select(selectHasMoreChatRooms);

  constructor() {}

  ngOnInit() {
    this.store.dispatch(loadMyChatRooms({ page: 0, size: 20 }));
  }
}
