import { Component } from '@angular/core';
import { ChatCardComponent } from "./chat-card/chat-card.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-chat-viewer',
    standalone: true,
    templateUrl: './chat-viewer.component.html',
    styleUrl: './chat-viewer.component.css',
    imports: [ChatCardComponent, CommonModule]
})
export class ChatViewerComponent {

}
