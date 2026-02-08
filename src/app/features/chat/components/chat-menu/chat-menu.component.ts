import { Component, inject, OnInit } from '@angular/core';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';
import { Store } from '@ngrx/store';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs';
import { ChatRoomType } from '../../../../core/models/message.model';

@Component({
  selector: 'app-chat-menu',
  templateUrl: './chat-menu.component.html',
  styleUrls: ['./chat-menu.component.css'],
  imports: [AvatarComponent, CommonModule],
})
export class ChatMenuComponent implements OnInit {
  private readonly store = inject(Store);
  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  isDirectMessage!: boolean;

  constructor() {
    this.selectedChatRoom$
      .pipe(
        tap((chatroom) => (this.isDirectMessage = chatroom?.type === ChatRoomType.DIRECT_MESSAGE)),
      )
      .subscribe();
  }

  ngOnInit() {}
}
