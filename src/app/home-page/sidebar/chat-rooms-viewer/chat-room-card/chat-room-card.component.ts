import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-room-card',
  standalone: true,
  imports: [],
  templateUrl: './chat-room-card.component.html',
  styleUrl: './chat-room-card.component.css'
})
export class ChatRoomCardComponent {

  randomGender() {
    var arr = ['male', 'female']
    return arr[Math.floor(arr.length * Math.random())];
  }

}
