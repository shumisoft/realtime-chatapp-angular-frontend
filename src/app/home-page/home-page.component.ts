import { Component } from '@angular/core';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { ChatWindowComponent } from "./chat-window/chat-window.component";

@Component({
    selector: 'app-home-page',
    standalone: true,
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css',
    imports: [SidebarComponent, ChatWindowComponent]
})
export class HomePageComponent {

}
