import { Component } from '@angular/core';
import { SidebarHeaderComponent } from "./sidebar-header/sidebar-header.component";
import { ChatRoomsViewerComponent } from "./chat-rooms-viewer/chat-rooms-viewer.component";

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    imports: [SidebarHeaderComponent, ChatRoomsViewerComponent]
})
export class SidebarComponent {

}
