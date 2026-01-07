import { Component, OnInit } from '@angular/core';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { ChatMenuComponent } from '../chat-menu/chat-menu.component';
import { ChatInputAreaComponent } from '../chat-input-area/chat-input-area.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [ChatAreaComponent, ChatMenuComponent, ChatInputAreaComponent],
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
