import { Component, inject, OnInit } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { ChatMenuComponent } from '../chat-menu/chat-menu.component';
import { ChatInputAreaComponent } from '../chat-input-area/chat-input-area.component';
import { Store } from '@ngrx/store';
import { selectSelectedChatRoom } from '../../../../core/store/chat-room/chat-room.selectors';
import { CommonModule } from '@angular/common';

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
}
