import { Component } from '@angular/core';
import { HomePageComponent } from "../home-page/home-page.component";

@Component({
    selector: 'app-home-view-controller',
    standalone: true,
    templateUrl: './home-view-controller.component.html',
    styleUrl: './home-view-controller.component.css',
    imports: [HomePageComponent]
})
export class HomeViewControllerComponent {

}
