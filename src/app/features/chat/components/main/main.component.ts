import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { selectChatRoom } from '../../../../core/store/chat-room/chat-room.actions';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { ChatInputAreaComponent } from '../chat-input-area/chat-input-area.component';
import { ChatMenuComponent } from '../chat-menu/chat-menu.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, ChatAreaComponent, ChatMenuComponent, ChatInputAreaComponent],
})
export class MainComponent implements OnInit {
  private readonly store = inject(Store);

  readonly selectedChatRoom$ = this.store.select(selectSelectedChatRoom);

  constructor() {}

  ngOnInit() {}

  // ✅ ESC key handler
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (keyboardEvent.key === 'Escape') {
      this.selectedChatRoom$.pipe(take(1)).subscribe((room) => {
        if (room) {
          this.store.dispatch(selectChatRoom({ chatId: null }));
        }
      });
    }
  }
}
