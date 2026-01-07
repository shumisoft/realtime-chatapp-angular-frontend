import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SidebarMenuComponent } from '../sidebar-menu/sidebar-menu.component';
import { ChatRoomCardComponent } from '../chat-room-card/chat-room-card.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule, SidebarMenuComponent, ChatRoomCardComponent],
  standalone: true,
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
