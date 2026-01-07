import { Component, OnInit } from '@angular/core';
import { ChatCardComponent } from '../chat-card/chat-card.component';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.css'],
  imports: [ChatCardComponent],
})
export class ChatAreaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
