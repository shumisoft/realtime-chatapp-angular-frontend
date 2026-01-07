import { Component } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { MainComponent } from '../../components/main/main.component';

@Component({
  selector: 'app-ui',
  standalone: true,
  imports: [SidebarComponent, MainComponent],
  templateUrl: './ui.html',
  styleUrl: './ui.css',
})
export class Ui {}
