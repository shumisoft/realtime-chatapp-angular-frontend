import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeViewControllerComponent } from "./home-view-controller/home-view-controller.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeViewControllerComponent]
})
export class AppComponent {
  title = 'realtime-chatapp-angular-frontend';
}
