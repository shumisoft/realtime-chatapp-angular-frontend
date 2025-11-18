import { Component } from '@angular/core';
import { ChatRoomCardComponent } from "./chat-room-card/chat-room-card.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chat-rooms-viewer',
    standalone: true,
    templateUrl: './chat-rooms-viewer.component.html',
    styleUrl: './chat-rooms-viewer.component.css',
    imports: [CommonModule, ChatRoomCardComponent]
})
export class ChatRoomsViewerComponent {

}
