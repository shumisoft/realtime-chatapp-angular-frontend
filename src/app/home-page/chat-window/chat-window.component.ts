import { Component } from '@angular/core';
import { ChatWindowHeaderComponent } from "./chat-window-header/chat-window-header.component";
import { ChatViewerComponent } from "./chat-viewer/chat-viewer.component";
import { ChatWindowInputAreaComponent } from "./chat-window-input-area/chat-window-input-area.component";

@Component({
    selector: 'app-chat-window',
    standalone: true,
    templateUrl: './chat-window.component.html',
    styleUrl: './chat-window.component.css',
    imports: [ChatWindowHeaderComponent, ChatViewerComponent, ChatWindowInputAreaComponent]
})
export class ChatWindowComponent {

}
