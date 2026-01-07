import { Component, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-chat-room-card',
  templateUrl: './chat-room-card.component.html',
  styleUrls: ['./chat-room-card.component.css'],
  imports: [AvatarComponent],
})
export class ChatRoomCardComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
